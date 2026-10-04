/*
 * Two-layer atmosphere:
 *  - rim:  FrontSide shell just above the surface. Fresnel glow on the limb.
 *  - halo: BackSide shell further out. Visible only in the annulus between the
 *          planet disc and the outer limb; brightest at the planet edge.
 * Both additive, both modulated so the sunlit side glows more.
 */
export const atmosphereVertex = /* glsl */ `
    varying vec3 vWN;
    varying vec3 vToCam;
    void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWN = normalize(mat3(modelMatrix) * normal);
        vToCam = normalize(cameraPosition - wp.xyz);
        gl_Position = projectionMatrix * viewMatrix * wp;
    }
`

export const rimFragment = /* glsl */ `
    uniform vec3 uInner;
    uniform vec3 uOuter;
    uniform vec3 uSunDir;
    uniform float uPower;
    uniform float uIntensity;
    varying vec3 vWN;
    varying vec3 vToCam;
    void main() {
        float facing = clamp(dot(vWN, vToCam), 0.0, 1.0);
        float fres = pow(1.0 - facing, uPower);
        float day = clamp(dot(vWN, uSunDir) * 0.6 + 0.45, 0.05, 1.0);
        vec3 col = mix(uOuter, uInner, fres) * fres * day * uIntensity;
        gl_FragColor = vec4(col, 1.0);
    }
`

export const haloFragment = /* glsl */ `
    uniform vec3 uInner;
    uniform vec3 uOuter;
    uniform vec3 uSunDir;
    uniform float uEdge;      // facing value at the planet's edge (sqrt(1 - (R/Rhalo)^2))
    uniform float uIntensity;
    varying vec3 vWN;
    varying vec3 vToCam;
    void main() {
        // back faces: normals point away from the camera, so -dot is positive
        float facing = clamp(-dot(vWN, vToCam), 0.0, 1.0);
        float t = clamp(facing / uEdge, 0.0, 1.0);   // 1 at planet edge → 0 at outer limb
        float glow = pow(t, 2.2);
        float day = clamp(dot(vWN, uSunDir) * 0.5 + 0.55, 0.1, 1.0);
        vec3 col = mix(uOuter, uInner, t) * glow * day * uIntensity;
        gl_FragColor = vec4(col, 1.0);
    }
`
