import hashlib
import sys

def normalize_and_hash(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    total_before = len(lines)
    removed_line_num = None
    removed_content = None
    cleaned_lines = []
    
    for idx, line in enumerate(lines, 1):
        if line.startswith("- **Run Timestamp:**"):
            removed_line_num = idx
            removed_content = line.strip()
        else:
            cleaned_lines.append(line)
            
    total_after = len(cleaned_lines)
    normalized_content = "".join(cleaned_lines)
    h = hashlib.sha256(normalized_content.encode('utf-8')).hexdigest()
    
    return {
        'total_before': total_before,
        'total_after': total_after,
        'removed_line_num': removed_line_num,
        'removed_content': removed_content,
        'hash': h
    }

def main():
    r1 = normalize_and_hash('run1_tables.md')
    r2 = normalize_and_hash('run2_tables.md')
    
    print("=== GATE 0: Normalised Output Comparison ===")
    print(f"run1_tables.md:")
    print(f"  Lines before normalisation: {r1['total_before']}")
    print(f"  Removed line number:        {r1['removed_line_num']} ({r1['removed_content']})")
    print(f"  Lines after normalisation:  {r1['total_after']}")
    print(f"  Normalised SHA-256:         {r1['hash']}")
    
    print(f"\nrun2_tables.md:")
    print(f"  Lines before normalisation: {r2['total_before']}")
    print(f"  Removed line number:        {r2['removed_line_num']} ({r2['removed_content']})")
    print(f"  Lines after normalisation:  {r2['total_after']}")
    print(f"  Normalised SHA-256:         {r2['hash']}")
    
    hashes_match = (r1['hash'] == r2['hash'])
    lines_valid = (r1['removed_line_num'] is not None and r2['removed_line_num'] is not None and
                   r1['removed_content'].startswith("- **Run Timestamp:**") and
                   r2['removed_content'].startswith("- **Run Timestamp:**"))
    
    print(f"\nHashes Match:       {hashes_match}")
    print(f"Timestamp Removed:  {lines_valid}")
    
    if hashes_match and lines_valid:
        print("\nGATE 0 STATUS: PASS")
        sys.exit(0)
    else:
        print("\nGATE 0 STATUS: STOP")
        sys.exit(1)

if __name__ == '__main__':
    main()
