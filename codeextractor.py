import os
import sys


def is_ignored_path(relative_path, ignored_exact_paths, ignored_prefixes):
    if relative_path in ignored_exact_paths:
        return True
    return any(
        relative_path == prefix or relative_path.startswith(prefix + os.sep)
        for prefix in ignored_prefixes
    )


def combine_code(root_dir, output_file, extensions=None):
    if extensions is None:
        extensions = ['.py', '.js', '.ts', '.html', '.css', '.json', '.md']

    ignored_dir_names = {'node_modules', '__pycache__', 'venv'}
    ignored_relative_prefixes = {
        os.path.normpath(os.path.join('electron-app', 'dist')),
        os.path.normpath(os.path.join('electron-app', 'release')),
        os.path.normpath(os.path.join('electron-app', 'out')),
    }
    ignored_relative_paths = {
        os.path.normpath(os.path.join('electron-app', 'package-lock.json')),
        os.path.normpath(os.path.join('data', 'reactions-db.json')),
        os.path.normpath(os.path.join('js', 'reactions-db.js')),
        os.path.normpath(os.path.join('data', 'bad-apple-payload.js')),
        os.path.normpath(os.path.join('data', 'bad-apple-payload-solubility.js')),
        os.path.normpath('audit_reactions_report.json'),
    }

    with open(output_file, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(root_dir):
            root_relative = os.path.normpath(os.path.relpath(root, root_dir))
            if root_relative == '.':
                root_relative = ''

            filtered_dirs = []
            for d in dirs:
                if d.startswith('.') or d in ignored_dir_names:
                    continue
                dir_relative_path = os.path.normpath(os.path.join(root_relative, d))
                if is_ignored_path(dir_relative_path, ignored_relative_paths, ignored_relative_prefixes):
                    continue
                filtered_dirs.append(d)
            dirs[:] = filtered_dirs

            for file in files:
                if not any(file.endswith(ext) for ext in extensions):
                    continue

                filepath = os.path.join(root, file)
                relative_path = os.path.normpath(os.path.join(root_relative, file))
                if is_ignored_path(relative_path, ignored_relative_paths, ignored_relative_prefixes):
                    continue

                try:
                    with open(filepath, 'r', encoding='utf-8') as infile:
                        outfile.write(f"\n{'=' * 60}\n")
                        outfile.write(f"ФАЙЛ: {filepath}\n")
                        outfile.write(f"{'=' * 60}\n\n")
                        outfile.write(infile.read())
                        outfile.write("\n")
                except Exception:
                    continue


if __name__ == "__main__":
    combine_code(".", "all_code.txt")
