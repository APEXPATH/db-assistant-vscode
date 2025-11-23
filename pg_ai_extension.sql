-- AI Query Generator Extension for PostgreSQL
-- Install this in your database to use AI directly in SQL

-- Create extension schema
CREATE SCHEMA IF NOT EXISTS ai_query;

-- Function to call external AI service
CREATE OR REPLACE FUNCTION ai_query.generate_sql(
    user_question TEXT,
    api_key TEXT DEFAULT NULL
)
RETURNS TEXT AS $$
import requests
import json
import os

def call_gemini_api(question, schema_info, api_key):
    """Call Gemini API to generate SQL"""
    if not api_key:
        api_key = os.getenv('GEMINI_API_KEY')
    
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
    
    prompt = f"""
    You are a SQL expert. Convert this question to PostgreSQL query.
    
    Database Schema: {schema_info}
    Question: {question}
    
    Rules:
    1. Return only SQL query, no explanation
    2. Use proper PostgreSQL syntax
    3. Only SELECT queries for safety
    """
    
    headers = {
        'Content-Type': 'application/json',
    }
    
    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    response = requests.post(f"{url}?key={api_key}", 
                           headers=headers, 
                           json=data)
    
    if response.status_code == 200:
        result = response.json()
        return result['candidates'][0]['content']['parts'][0]['text']
    else:
        return f"Error: {response.text}"

# Get current database schema
schema_query = """
    SELECT string_agg(
        'Table: ' || table_name || E'\nColumns: ' || 
        string_agg(column_name || ' (' || data_type || ')', ', '), 
        E'\n\n'
    )
    FROM information_schema.columns 
    WHERE table_schema = 'public'
    GROUP BY table_name
"""

plpy.execute("SELECT ai_query.get_schema_info()")
schema_info = plpy.execute(schema_query)[0]['string_agg']

return call_gemini_api(user_question, schema_info, api_key)

$$ LANGUAGE plpython3u;

-- Helper function to get schema info
CREATE OR REPLACE FUNCTION ai_query.get_schema_info()
RETURNS TEXT AS $$
    SELECT string_agg(
        'Table: ' || table_name || E'\nColumns: ' || 
        string_agg(column_name || ' (' || data_type || ')', ', '), 
        E'\n\n'
    )
    FROM information_schema.columns 
    WHERE table_schema = 'public'
    GROUP BY table_name;
$$ LANGUAGE sql;

-- Convenience function for quick queries
CREATE OR REPLACE FUNCTION ai_query.ask(question TEXT)
RETURNS TABLE(generated_sql TEXT, result_preview TEXT) AS $$
DECLARE
    sql_query TEXT;
    preview TEXT;
BEGIN
    -- Generate SQL
    SELECT ai_query.generate_sql(question) INTO sql_query;
    
    -- Try to execute and get preview (first 5 rows)
    BEGIN
        EXECUTE 'SELECT string_agg(row_to_json(t)::text, E''\n'') FROM (' || 
                sql_query || ' LIMIT 5) t' INTO preview;
    EXCEPTION WHEN OTHERS THEN
        preview := 'Error executing query: ' || SQLERRM;
    END;
    
    RETURN QUERY SELECT sql_query, preview;
END;
$$ LANGUAGE plpgsql;