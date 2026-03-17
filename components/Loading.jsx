'use client'

const Loading = () => {

    return (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-[1px]'>
            <div className='loading-wave' aria-label='Loading'>
                <div className='loading-bar'></div>
                <div className='loading-bar'></div>
                <div className='loading-bar'></div>
                <div className='loading-bar'></div>
            </div>
        </div>
    )
}

export default Loading