## Notes:

1. "__dirname" and "__filename" did'nt exist in ES6 modules. So, we use {dirname} from "path" module and {fileURLToPath} from "url" and "import.meta.url" to get the current directory name in which we are working.

2. "path.join()" is use always to give the path because in different operating systems path structure is different.
