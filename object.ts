//An object has both a mesh and a shader

import { Mesh } from "./mesh";
import { Shader } from "./shader";

class Object {
    /**@param mesh the objects mesh */
    mesh: Mesh
    shader: Shader
    
}
export { Object }