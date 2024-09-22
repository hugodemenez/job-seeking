import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 24,
                    background: 'black',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fill: 'white',
                    borderRadius: '2px',
                }}
            >
                <svg width="9" height="24" viewBox="0 0 13 32" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6.30986" cy="6.30986" r="6.30986"  />
                    <path d="M12.6197 20.7324C12.6197 24.2172 9.7947 32 6.30986 32C2.82502 32 0 24.2172 0 20.7324C0 17.2476 2.82502 14.4225 6.30986 14.4225C9.7947 14.4225 12.6197 17.2476 12.6197 20.7324Z" />
                </svg>
            </div>
        ),
        // ImageResponse options
        {
            // For convenience, we can re-use the exported icons size metadata
            // config to also set the ImageResponse's width and height.
            ...size,
        }
    )
}