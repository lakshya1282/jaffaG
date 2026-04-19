import os

file_path = "c:\\Users\\laksh\\OneDrive\\Desktop\\jaffaa\\jaffaG\\main.js"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the insertion point
# We are looking for where it broke: }, 3); followed by y: yPos,
start_idx = -1
for i, line in enumerate(lines):
    if "}, 3);" in line and i + 1 < len(lines) and "y: yPos," in lines[i+1]:
        start_idx = i
        break

if start_idx == -1:
    print("Could not find the broken point.")
    import sys
    sys.exit(1)

# The content to insert
restoration_and_feature = [
    "}, 3);\n",
    "\n",
    "// Phase 4: Fade out text towards the end\n",
    "heroTl.to(\".hero-text-overlay\", {\n",
    "    opacity: 0,\n",
    "    y: -100,\n",
    "    duration: 3,\n",
    "    ease: \"power2.in\"\n",
    "}, 10);\n",
    "\n",
    "// --- End New Scroll Hero Implementation ---\n",
    "\n",
    "// Initial Kickoff\n",
    "window.addEventListener('DOMContentLoaded', () => {\n",
    "    // Initial reveal animation for navbar\n",
    "    gsap.from(\".navbar\", { y: -50, opacity: 0, duration: 1, ease: \"power3.out\" });\n",
    "\n",
    "    // Navbar scroll animation (Desktop only)\n",
    "    ScrollTrigger.create({\n",
    "        start: \"top -100\",\n",
    "        onUpdate: (self) => {\n",
    "            if (self.direction === 1) {\n",
    "                document.querySelector(\".navbar\")?.classList.add(\"shrunk\");\n",
    "            } else {\n",
    "                document.querySelector(\".navbar\")?.classList.remove(\"shrunk\");\n",
    "            }\n",
    "        }\n",
    "    });\n",
    "});\n",
    "\n",
    "\n",
    "// Mouse Parallax Effect for Canvas\n",
    "window.addEventListener('mousemove', (e) => {\n",
    "    const { clientX, clientY } = e;\n",
    "    const xPos = (clientX / window.innerWidth - 0.5) * 20; // Subtle movement\n"
]

# We also need to fix the line AFTER the gap which was part of the old mousemove listener
# Original was: const yPos = (clientY / window.innerHeight - 0.5) * 20;
# Then: gsap.to("#hero-canvas", { x: xPos, y: yPos, ...
# Currently we have: y: yPos, ...

# I'll just replace the broken segment entirely.
# From the line after }, 3); to the end of that gsap.to block.

end_idx = start_idx + 1
while end_idx < len(lines) and "});" not in lines[end_idx]:
    if "Catalog Slider Logic" in lines[end_idx]: # Stop if we hit the next section
        break
    end_idx += 1

# Actually, I'll just reconstruct the whole mousemove listener too
restoration_and_feature.extend([
    "    const yPos = (clientY / window.innerHeight - 0.5) * 20;\n",
    "\n",
    "    gsap.to(\"#hero-canvas\", {\n",
    "        x: xPos,\n"
])

# New lines assembly
new_lines = lines[:start_idx] + restoration_and_feature + lines[start_idx+1:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Success")
