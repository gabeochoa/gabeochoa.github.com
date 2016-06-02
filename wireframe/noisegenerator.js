function generateRandom(a,b)
{
    return (Math.random()*b) + a;
}

function Create2DArray(rows) {
  var arr = [];

  for (var i=0;i<rows;i++) {
     arr[i] = [];
  }

  return arr;
}

function myclamp(v, a,b)
{
    if(v < a)
        return a;
    if(v > b)
        return b;
    return v;
}

function Generate(width, height, seed, scale, octaves, persistance, lacunarity, offset, minHeight, maxHeight)
{
//normalizemode = local;
// float persistance, float lacunarity, Vector2 offset, NormalizeMode normalizeMode) {
        noiseMap = Create2DArray(width);
        octaveOffsets = Create2DArray(octaves);
        maxPossibleHeight = 0;
        amplitude = 1;
        frequency = 1;

        for (i = 0; i < octaves; i++) {
            offsetX = generateRandom(-1000000, 1000000) + offset[0];
            offsetY = generateRandom(-1000000, 1000000) - offset[1];
            octaveOffsets [i] = [offsetX, offsetY];

            maxPossibleHeight += amplitude;
            amplitude *= persistance;
        }

        if (scale <= 0) {
            scale = 0.0001;
        }

        maxLocalNoiseHeight = Number.MinValue;
        minLocalNoiseHeight = Number.MaxValue;

        halfWidth = width / 2.0;
        halfHeight = height / 2.0;


        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {

                amplitude = 1;
                frequency = 1;
                noiseHeight = 0;

                for ( i = 0; i < octaves; i++) {
                    sampleX = (x-halfWidth + octaveOffsets[i][0]) / scale * frequency;
                    sampleY = (y-halfHeight + octaveOffsets[i][1]) / scale * frequency;

                    perlinValue = noise.simplex2(sampleX, sampleY) * 2 - 1;
                    noiseHeight += perlinValue * amplitude;

                    amplitude *= persistance;
                    frequency *= lacunarity;
                }

                if (noiseHeight > maxLocalNoiseHeight) {
                    maxLocalNoiseHeight = noiseHeight;
                } else if (noiseHeight < minLocalNoiseHeight) {
                    minLocalNoiseHeight = noiseHeight;
                }
                noiseMap [x][y] = noiseHeight;
            }
        }

        for (y = 0; y < height; y++) 
        {
            for (x = 0; x < width; x++) 
            {
                normalizedHeight = (noiseMap[x][y] + 1) / (maxPossibleHeight/0.9);
                noiseMap [x][y] = myclamp(normalizedHeight,minHeight, maxHeight);
            }
        }

        return noiseMap;
}
