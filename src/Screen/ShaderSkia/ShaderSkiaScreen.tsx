import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import {ScreenContainer} from '../../Component';
import {
  Canvas,
  Fill,
  ImageShader,
  Shader,
  Skia,
  useClockValue,
  useComputedValue,
  useImage,
} from '@shopify/react-native-skia';

const screen = Dimensions.get('window');

const image =
  'https://fastly.picsum.photos/id/124/3504/2336.jpg?hmac=B1Avp6or9Df8vpnN4kQsGNfD66j8hH3gLtootCoTw4M';

const ShaderSkiaScreen: React.FC<any> = ({navigation}) => {
  const clock = useClockValue();

  const uniforms = useComputedValue(() => {
    return {
      clock: clock.current,
      resolution: [screen.width, screen.height],
    };
  }, [clock, screen.width, screen.height]);

  const imgSrc = Skia.RuntimeEffect.Make(`
    uniform shader image;
    uniform float clock;
    uniform float2 resolution;
     
    half4 main(float2 xy) {   
    
    //check if y < half of screen height then not plus clock value
    
    float y = 0;
    
    if (xy.y < resolution.y / 2) {

    } else {
      y = cos((xy.y + clock / 10)/20) * 4;
    }
    
    
    
      xy.x += y;
      return image.eval(xy).rbga;
}`)!;

  const testSrc = Skia.RuntimeEffect.Make(`
    uniform float2 resolution;
    uniform float clock;
    const float MAX_DIST = 100.0;
    const int MAX_STEPS = 100;
    const float SURF_DIST = .01;
    
    float getDist(vec3 p) {
      vec4 sphere = vec4(0,1,5,1);
      float dS = length(p - sphere.xyz) - sphere.w;
      float dP = p.y;
      float d = min(dS, dP);
      return d;
    }
    
    float RayMarch(vec3 ro, vec3 rd) {
      float d0 = 0.0;
      for (int i = 0; i < MAX_STEPS; i++) {
          vec3 p = ro + rd * d0;
          float ds = getDist(p);
          d0 += ds;
          if (ds < SURF_DIST || d0 > MAX_DIST) break;
      }
      return d0;
    
    }
    
    vec3 getNormal(vec3 p) {
      float d = getDist(p);
      vec2 e = vec2(0.01, 0);
      vec3 n = d - vec3(
        getDist(p - e.xyy),
        getDist(p - e.yxy),
        getDist(p - e.yyx)
      );
      return normalize(n);
    }
    
    float getLight(vec3 p) {
      vec3 light = vec3(0, 5, 0);
      float iTime = clock / 1000.0;
      light = vec3(sin(iTime),sin(iTime)*3+5, cos(iTime));
      vec3 l = normalize(light - p);
      vec3 n = getNormal(p);
     
      float dif = dot(n, l);
     
      float d = RayMarch(p + n * SURF_DIST*2, l);
      if (d < length(light - p)) dif *= .1;
      
      return dif;
    }
    
    vec4 main(vec2 fragCoord) {
      vec2 uv = (fragCoord - .5*resolution.xy) / resolution.y;
      vec3 col = vec3(0);
      vec3 ro = vec3(0,2,0);
      vec3 rd = normalize(vec3(uv.x,-uv.y, 0.5));
      
      float d = RayMarch(ro, rd);
      vec3 p = ro + rd * d;
      
      float dif = getLight(p);
      
      col = vec3(dif);
      
      float opacity = 1.0;
      
      if (d > MAX_DIST) opacity = 0.0;
            
      return vec4(col, opacity);
    }
  `)!;

  const imageShader = useImage(image);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'red',
      }}>
      <Canvas
        style={{
          width: screen.width,
          height: screen.height,
          backgroundColor: 'transparent',
        }}>
        <Fill>
          <Shader source={testSrc} uniforms={uniforms}></Shader>
        </Fill>
      </Canvas>
    </View>
  );
};

export default ShaderSkiaScreen;
