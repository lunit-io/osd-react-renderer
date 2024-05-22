#version 300 es

precision mediump float;
out vec4 pixColor;
 
void main()
{
     float r = 0.0, delta = 0.0, alpha = 1.0;
     vec2 cxy = 2.0 * gl_PointCoord - 1.0;
     r = dot(cxy, cxy);
     delta = fwidth(r);
     alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);

    pixColor = vec4(0.1, 0.6, 0.6, 1.0);
 
}