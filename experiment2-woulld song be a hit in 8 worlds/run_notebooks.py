"""Execute the canonical Music Lab notebooks, in order, without kernel sockets.

Each notebook runs in a fresh IPython process. Captures tables, text and figures
in the .ipynb, validates the notebook, and stops at the first failed assertion.
Use a Python environment containing requirements.txt; run from any directory.
"""
from pathlib import Path
import os
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parent
NOTEBOOKS = sorted((ROOT / 'notebooks').glob('[0-9][0-9]_*.ipynb'))

def execute(path):
    import io
    import nbformat
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    from IPython.core.interactiveshell import InteractiveShell
    from IPython.utils.capture import capture_output
    from IPython.display import display, Image

    os.chdir(ROOT / 'notebooks')
    notebook = nbformat.read(path, as_version=4)
    shell = InteractiveShell.instance()

    def inline_show(*args, **kwargs):
        for number in plt.get_fignums():
            buffer = io.BytesIO()
            plt.figure(number).savefig(buffer, format='png', bbox_inches='tight')
            display(Image(data=buffer.getvalue()))
        plt.close('all')

    plt.show = inline_show
    count = 0
    for cell in notebook.cells:
        if cell.cell_type != 'code':
            continue
        count += 1
        with capture_output() as captured:
            result = shell.run_cell(cell.source, store_history=False)
        error = result.error_before_exec or result.error_in_exec
        if error:
            sys.stderr.write(captured.stdout + captured.stderr)
            raise RuntimeError(f'{path.name}, code cell {count}: {error}') from error
        cell.execution_count = count
        cell.outputs = []
        for name, text in [('stdout', captured.stdout), ('stderr', captured.stderr)]:
            if text:
                cell.outputs.append(nbformat.v4.new_output('stream', name=name, text=text))
        for output in captured.outputs:
            cell.outputs.append(nbformat.v4.new_output('display_data', data=output.data, metadata=output.metadata))
    notebook.metadata['execution_note'] = 'Executed sequentially in a fresh IPython process by run_notebooks.py; all code cells and assertions passed.'
    nbformat.validate(notebook)
    nbformat.write(notebook, path)
    print(f'PASS {path.name} ({count} code cells)', flush=True)

if __name__ == '__main__':
    if len(sys.argv) == 3 and sys.argv[1] == '--one':
        execute(Path(sys.argv[2]))
    else:
        with tempfile.TemporaryDirectory(prefix='musiclab-run-') as tmp:
            env = os.environ.copy()
            env.update(MPLCONFIGDIR=str(Path(tmp)/'matplotlib'), IPYTHONDIR=str(Path(tmp)/'ipython'), XDG_CACHE_HOME=str(Path(tmp)/'cache'))
            for notebook in NOTEBOOKS:
                subprocess.run([sys.executable, str(Path(__file__).resolve()), '--one', str(notebook)], env=env, check=True)
        print('All canonical notebooks completed. Website assets are in web-assets/.')
