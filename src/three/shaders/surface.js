/*
 * Injected into MeshStandardMaterial via three-custom-shader-material.
 * Adds emissive city lights that only appear on the night side.
 */
export const surfaceVertex = /* glsl */ `
    varying vec3 vWN;
    varying vec2 vUv2;
    void main() {
        vWN = normalize(mat3(modelMatrix) * normal);
        vUv2 = uv;
    }
`

export const surfaceFragment = /* glsl */ `
    uniform sampler2D uLights;
    uniform vec3 uSunDir;
    uniform vec3 uLightColor;
    varying vec3 vWN;
    varying vec2 vUv2;
    void main() {
        float sun = dot(vWN, normalize(uSunDir));
        // 1 on the night side, 0 on the day side, soft terminator
        float night = 1.0 - smoothstep(-0.25, 0.12, sun);
        float lights = texture2D(uLights, vUv2).r;
        // × 2.4 pushes the lights over the bloom threshold
        csm_Emissive = uLightColor * lights * night * 2.4;
    }
`
