import os
import sys

def combine_code(root_dir, output_file, extensions=None):
    if extensions is None:
        extensions = ['.py', '.js', '.ts', '.html', '.css', '.json', '.md']
    
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(root_dir):
            # Пропускаем служебные папки
            dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', '__pycache__', 'venv']]
            
            for file in files:
                if any(file.endswith(ext) for ext in extensions):
                    filepath = os.path.join(root, file)
                    try:
                        with open(filepath, 'r', encoding='utf-8') as infile:
                            outfile.write(f"\n{'='*60}\n")
                            outfile.write(f"ФАЙЛ: {filepath}\n")
                            outfile.write(f"{'='*60}\n\n")
                            outfile.write(infile.read())
                            outfile.write("\n")
                    except:
                        continue

if __name__ == "__main__":
    combine_code(".", "all_code.txt")