// oxlint-disable next/no-img-element
// oxlint-disable jsx-a11y/alt-text
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export function GET(request: NextRequest) {
  const size = Math.min(512, Math.max(16, Number(request.nextUrl.searchParams.get('size') ?? 32)));

  const svg = readFileSync(join(process.cwd(), 'public/user-icon-base.svg'));
  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

  return new ImageResponse(
    <img src={dataUri} width={size} height={size} style={{ objectFit: 'contain' }} />,
    { width: size, height: size },
  );
}
