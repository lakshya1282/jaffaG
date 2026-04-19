import os

file_path = "c:\\Users\\laksh\\OneDrive\\Desktop\\jaffaa\\jaffaG\\style.css"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define the old block (exactly as it appears with possible CRLF)
old_block = """/* Navbar */
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    padding: 1.5rem 4rem;
    background: transparent;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1800px;
    margin: 0 auto;
}

.logo {
    display: flex;
    flex-direction: column;
    letter-spacing: 2px;
    text-decoration: none;
    color: #ffffff;
    transition: opacity 0.3s ease;
}

.logo:hover {
    opacity: 0.8;
}

.logo-text {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
    color: #ffffff;
}

.logo-sub {
    font-family: var(--font-heading);
    font-size: 0.8rem;
    font-weight: 400;
    margin-left: 2px;
    color: #ffffff;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 3rem;
}

.nav-links a {
    text-decoration: none;
    color: var(--text-dim);
    font-size: 0.9rem;
    text-transform: lowercase;
    transition: color 0.3s ease;
}

.nav-links a:hover {
    color: #e6b905;
}

.nav-cta a {
    padding: 0.8rem 1.5rem;
    border: 1px solid var(--glass-border);
    border-radius: 50px;
    color: var(--text-main);
    text-decoration: none;
    font-size: 0.85rem;
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.nav-cta a:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--text-main);
}"""

new_block = """/* Navbar - Liquid Glass Floating Pill */
.navbar {
    position: fixed;
    top: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 4rem);
    max-width: 1400px;
    z-index: 1000;
    background: rgba(10, 10, 10, 0.4);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 100px;
    padding: 0.8rem 2.5rem;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.logo {
    display: flex;
    flex-direction: column;
    letter-spacing: 2px;
    text-decoration: none;
    color: #ffffff;
    transition: opacity 0.3s ease;
    flex: 1; 
}

.logo:hover {
    opacity: 0.8;
}

.logo-text {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1;
    color: #ffffff;
}

.logo-sub {
    font-family: var(--font-heading);
    font-size: 0.7rem;
    font-weight: 400;
    margin-left: 2px;
    color: #ffffff;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 3.5rem;
    justify-content: center;
    flex: 2;
}

.nav-links a {
    text-decoration: none;
    color: var(--text-dim);
    font-size: 0.85rem;
    text-transform: lowercase;
    font-weight: 300;
    letter-spacing: 0.05rem;
    transition: all 0.3s ease;
}

.nav-links a:hover {
    color: #ffffff;
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

.nav-cta {
    display: flex;
    justify-content: flex-end;
    flex: 1;
}

.nav-cta a {
    padding: 0.7rem 1.8rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    color: var(--text-main);
    text-decoration: none;
    font-size: 0.8rem;
    background: rgba(255, 255, 255, 0.05);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    white-space: nowrap;
}

.nav-cta a:hover {
    background: var(--text-main);
    color: var(--bg-dark);
    border-color: var(--text-main);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
}"""

# Try both LF and CRLF matching
if old_block in content:
    content = content.replace(old_block, new_block)
else:
    old_block_crlf = old_block.replace('\n', '\r\n')
    if old_block_crlf in content:
        content = content.replace(old_block_crlf, new_block.replace('\n', '\r\n'))
    else:
        # One last try: just normalize spaces if needed
        print("Block not found exactly. Checking normalization...")
        # Since I can't easily normalize here without risking breaks, I'll exit with error for now
        import sys
        sys.exit(1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Success")
