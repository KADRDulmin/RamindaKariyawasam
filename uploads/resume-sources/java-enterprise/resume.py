from pathlib import Path
import runpy
import sys

sys.argv = ["build_resumes.py", "java-enterprise"]
runpy.run_path(str(Path(__file__).resolve().parents[1] / "build_resumes.py"), run_name="__main__")
