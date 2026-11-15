import csv
import os
import sys

def verify_manifest():
    manifest_path = 'numbers_manifest.csv'
    if not os.path.exists(manifest_path):
        print(f"Error: {manifest_path} does not exist.")
        sys.exit(1)

    with open(manifest_path, 'r', encoding='utf-8') as f:
        reader = list(csv.DictReader(f))

    file_cache = {}
    total = len(reader)
    matches = 0
    mismatches = 0

    print(f"=== Verifying {total} Numbers in Manifest ===")

    for idx, row in enumerate(reader, 1):
        val = row['value'].strip()
        desc = row['description'].strip()
        src = row['source_file'].strip()
        tbl = row['table_or_block'].strip()
        key = row['row_key'].strip()

        if src not in file_cache:
            if not os.path.exists(src):
                print(f"[{idx}/{total}] MISMATCH: File not found {src} for {desc}")
                mismatches += 1
                continue
            with open(src, 'r', encoding='utf-8') as sf:
                file_cache[src] = sf.readlines()

        lines = file_cache[src]
        found = False

        # Target matching: look for line containing row_key, then check value
        target_lines = [l for l in lines if key in l]
        if target_lines:
            for l in target_lines:
                if val in l:
                    found = True
                    break
        else:
            # Fallback: check if value exists in entire file
            for l in lines:
                if val in l:
                    found = True
                    break

        if found:
            print(f"[{idx:03d}/{total:03d}] MATCH: {val:<12} | {src:<28} | {desc}")
            matches += 1
        else:
            print(f"[{idx:03d}/{total:03d}] MISMATCH: {val:<12} NOT FOUND with key '{key}' in {src} ({desc})")
            mismatches += 1

    print("\n" + "=" * 60)
    print(f"Total numbers: {total}")
    print(f"MATCH:         {matches}")
    print(f"MISMATCH:      {mismatches}")
    print("=" * 60)

    if mismatches == 0:
        print("\nGATE 3 STATUS: PASS")
        sys.exit(0)
    else:
        print("\nGATE 3 STATUS: STOP")
        sys.exit(1)

if __name__ == '__main__':
    verify_manifest()
