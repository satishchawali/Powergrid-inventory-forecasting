import mysql.connector
import os

def setup():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root"
        )
        cursor = conn.cursor()
        
        print("Recreating database...")
        cursor.execute("DROP DATABASE IF EXISTS powergrid_inventory")
        cursor.execute("CREATE DATABASE powergrid_inventory")
        cursor.execute("USE powergrid_inventory")
        
        schema_path = "backend/database/schema.sql"
        print(f"Applying schema from {schema_path}...")
        with open(schema_path, "r") as f:
            schema_sql = f.read()
            
        # Split by semicolon, but handle case where it's inside quotes if possible
        # For this schema, simple split is likely fine
        commands = schema_sql.split(";")
        for command in commands:
            cmd = command.strip()
            if cmd:
                try:
                    cursor.execute(cmd)
                except Exception as e:
                    print(f"Error executing: {cmd[:50]}... -> {e}")
        
        conn.commit()
        cursor.close()
        conn.close()
        print("Database setup complete.")
        
    except Exception as e:
        print(f"Setup failed: {e}")

if __name__ == "__main__":
    setup()
