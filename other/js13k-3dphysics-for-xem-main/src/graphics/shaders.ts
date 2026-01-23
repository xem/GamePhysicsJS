import mainFragStr from './shaders/main.frag?raw';
import mainVertStr from './shaders/main.vert?raw';

export const MAIN_FRAG = mainFragStr;
export const MAIN_VERT = mainVertStr;

export const ATTRIBUTE_COLOR = 'v_color';
export const ATTRIBUTE_NORMAL = 'v_normal';
export const ATTRIBUTE_POSITION = 'v_position';
export const ATTRIBUTE_TEXCOORD = 'v_texcoord';
export const ATTRIBUTE_WORLDMATRIX = 'v_worldMatrix';

export const UNIFORM_AMBIENTLIGHT = 'u_ambientLight';
export const UNIFORM_CAMERAPOSITION = 'u_cameraPosition';
export const UNIFORM_LIGHTPOSITION = 'u_lightPosition';
export const UNIFORM_PROJECTIONMATRIX = 'u_projectionMatrix';
export const UNIFORM_VIEWMATRIX = 'u_viewMatrix';
