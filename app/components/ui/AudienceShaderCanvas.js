"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    vec2 mouse = u_mouse / u_resolution.xy;
    float dist = distance(st, vec2(mouse.x * (u_resolution.x/u_resolution.y), 1.0 - mouse.y));
    
    vec2 warp = st + vec2(snoise(st * 2.0 + u_time * 0.15), snoise(st * 2.0 - u_time * 0.15)) * 0.8;
    warp += (1.0 - smoothstep(0.0, 0.6, dist)) * 0.15 * vec2(snoise(st + u_time));

    float n1 = snoise(warp * 1.2 + u_time * 0.1);
    float n2 = snoise(warp * 2.5 - u_time * 0.12);
    
    float blend1 = smoothstep(-0.8, 0.8, n1);
    float blend2 = smoothstep(-0.6, 0.6, n2);
    
    vec3 col = mix(u_color1, u_color2, blend1);
    col = mix(col, u_color3, blend2);

    // Film grain overlay
    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.04;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
    ] : [0, 0, 0];
}

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}

export default function AudienceShaderCanvas({ palette }) {
    const canvasRef = useRef(null);
    const prefersReducedMotion = useReducedMotion();
    const [isWebGLAvailable, setIsWebGLAvailable] = useState(true);

    const currentPalette = useRef(palette.map(hexToRgb));
    const targetPalette = useRef(palette.map(hexToRgb));
    const mousePos = useRef({ x: 0, y: 0 });
    const targetMousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        targetPalette.current = palette.map(hexToRgb);
    }, [palette]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            targetMousePos.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (prefersReducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            setIsWebGLAvailable(false);
            return;
        }

        // Compile shaders
        const compileShader = (type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        // Quad buffer
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = new Float32Array([
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
            -1.0,  1.0,
             1.0, -1.0,
             1.0,  1.0,
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const uTime = gl.getUniformLocation(program, 'u_time');
        const uResolution = gl.getUniformLocation(program, 'u_resolution');
        const uMouse = gl.getUniformLocation(program, 'u_mouse');
        const uColor1 = gl.getUniformLocation(program, 'u_color1');
        const uColor2 = gl.getUniformLocation(program, 'u_color2');
        const uColor3 = gl.getUniformLocation(program, 'u_color3');

        let animationFrameId;
        let lastTime = 0;
        const fpsInterval = 1000 / (window.innerWidth < 640 ? 24 : 30);
        let startTime = performance.now();
        let isVisible = true;

        const resize = () => {
            if (!canvas) return;
            const resolutionScale = window.innerWidth < 640 ? 0.35 : 0.5;
            canvas.width = canvas.clientWidth * resolutionScale;
            canvas.height = canvas.clientHeight * resolutionScale;
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        window.addEventListener('resize', resize);
        resize();

        // Intersection Observer to pause when offscreen
        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
        });
        observer.observe(canvas);

        const render = (time) => {
            animationFrameId = requestAnimationFrame(render);

            if (!isVisible || document.hidden) return; // Pause

            const elapsed = time - lastTime;
            if (elapsed < fpsInterval) return; // Throttle to target FPS
            lastTime = time - (elapsed % fpsInterval);

            // Lerp mouse
            mousePos.current.x = lerp(mousePos.current.x, targetMousePos.current.x, 0.05);
            mousePos.current.y = lerp(mousePos.current.y, targetMousePos.current.y, 0.05);

            // Lerp palette colors
            for (let i = 0; i < 3; i++) {
                currentPalette.current[i][0] = lerp(currentPalette.current[i][0], targetPalette.current[i][0], 0.05);
                currentPalette.current[i][1] = lerp(currentPalette.current[i][1], targetPalette.current[i][1], 0.05);
                currentPalette.current[i][2] = lerp(currentPalette.current[i][2], targetPalette.current[i][2], 0.05);
            }

            gl.uniform1f(uTime, (time - startTime) * 0.001);
            gl.uniform2f(uResolution, canvas.width, canvas.height);
            gl.uniform2f(uMouse, mousePos.current.x, mousePos.current.y);
            gl.uniform3fv(uColor1, currentPalette.current[0]);
            gl.uniform3fv(uColor2, currentPalette.current[1]);
            gl.uniform3fv(uColor3, currentPalette.current[2]);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        };
        
        requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
            observer.disconnect();
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteBuffer(positionBuffer);
        };
    }, [prefersReducedMotion]);

    if (!isWebGLAvailable || prefersReducedMotion) {
        // Pure CSS fallback
        return (
            <div className="absolute inset-0 overflow-hidden bg-slate-50 transition-colors duration-1000" style={{ backgroundColor: palette[0] }}>
                <div 
                    className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-60 mix-blend-multiply blur-[80px]"
                    style={{ backgroundColor: palette[1], transition: 'background-color 1s ease' }}
                />
                <div 
                    className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-60 mix-blend-multiply blur-[80px]"
                    style={{ backgroundColor: palette[2], transition: 'background-color 1s ease' }}
                />
            </div>
        );
    }

    return (
        <canvas 
            ref={canvasRef} 
            className="w-full h-full block absolute inset-0 z-0 pointer-events-none"
            aria-hidden="true"
        />
    );
}
