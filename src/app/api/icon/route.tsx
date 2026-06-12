import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export function GET(request: NextRequest) {
  const size = Math.min(512, Math.max(16, Number(request.nextUrl.searchParams.get('size') ?? 32)));

  const svg = readFileSync(path.join(process.cwd(), 'public/user-icon-base.svg'));
  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

  return new ImageResponse(
    <img src={dataUri} width={size} height={size} alt="" style={{ objectFit: 'contain' }} />,
    { width: size, height: size },
  );
}
