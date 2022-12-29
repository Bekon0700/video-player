const createThumbnail = (video) => {
    console.log(typeof video)
    video.currentTime = 15;
    const canvas = document.createElement('canvas')
    canvas.width = 600;
    canvas.height = 600;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    video.pause()
    return canvas.toDataURL('image/jpeg')
}

const videoSrcSetter = (video) => {
    const tempPath = URL.createObjectURL(video)
    // const videoFile = document.createElement('video')
    // videoFile.autoplay = true;
    // videoFile.muted = true;
    // videoFile.src = tempPath;

    // console.log(createThumbnail(videoFile))
    $('#video-src').attr('src', tempPath)
    $('#video-player')[0].load()
    $('#video-player').css('background-color', 'rgba(0, 0, 0, 0)')
    // $('#video-player').attr('controls', true)
    // $('#video-player').attr('poster', './bicycle_art_cyclist_127132_1366x768.jpg')

}

const videoFileData = (video) => {
    const file = new FileReader()
    file.readAsDataURL(video)
    file.onload = function (e) {
        $('#video-src').attr('src', e.target.result)
        $('#video-player')[0].load()
        $('#video-player').attr('controls', true)
    }
}


// get the file from the event listener
$('.video-input').on('change', function (e) {
    e.preventDefault()
    const videoData = $('.video-input')[0].files[0]

    // setting the video player's source>src to the uploaded file link

    /* solution 1 for generating temporary path of the video */
    videoSrcSetter(videoData)

    /* solution 2 for creating new file reader and can be uploaded from here */
    // videoFileData(videoData[0])
})

$('#play').on('click', function() {
    const video = $('#video-player')[0]
    if(video.paused) {
        video.play()
        $('#play').attr('name', 'pause-circle-outline')
        // $(this).text('Pause')
    } else {
        video.pause()
        $('#play').attr('name', 'play-outline')
        // $(this).text('Play')
    }
})
$('#seek-backward').on('click', function() {
    const video = $('#video-player')[0]
    video.currentTime -= 10
    const min = parseInt(video.duration / 60)
    const sec = parseInt(video.duration % 60)
    console.log(`${min}:${sec}`)
})
$('#seek-forward').on('click', function() {
    const video = $('#video-player')[0]
    video.currentTime += 10
    const min = parseInt(video.duration / 60)
    const sec = parseInt(video.duration % 60)
    console.log(`${min}:${sec}`)
})

$('#video-player').on('timeupdate', function() {
    const video = $('#video-player')[0]
    const duration = video.duration
    const currentTime = video.currentTime
    const cursorPointer = parseFloat((currentTime / duration) * 100).toFixed(2) * 1
    if(duration && currentTime) {
        const d = 100 - cursorPointer
        $('#progress-indicator').css('transform', `translate(${d}%, -50%)`)
        $('#progress').css('width', `${cursorPointer}%`)
    }
    if(currentTime == duration) {
        $('#play').attr('name', 'play-outline')
    }
})

$('.timeline').on('click', function() {
    console.log(this)
})