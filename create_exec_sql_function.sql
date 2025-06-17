-- Setup Supabase stored procedure to execute SQL
-- First, we need to create a stored procedure that can execute arbitrary SQL
CREATE OR REPLACE FUNCTION exec_sql(sql_string text) RETURNS void AS $$ BEGIN EXECUTE sql_string;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;