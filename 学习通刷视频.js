// 改编自https://juejin.cn/post/7082695718565052429，原作者元荣，功能：学习通自动点击并播放所有视频 ；功能变化：1.在我（54unds）的环境下可以正常监测章节是否完成2.如果一个章节有多个视频，现在可自动观看，3.如果一个章节有多个子章节，其中有视频，现在也可以自动观看
//只是草稿写的不稳定，作者不擅长js（之前几乎没有接触），算是练习，我的浏览器是chrome，使用方法：到学习通你要学的课程开头，点进去第一章，f12打开调试，右上角选中console或控制台，复制黏贴放进去，开始运行，等待，运行前最好完成该课程所有视频之外的任务点

let currentIndex = 0;//当前章节
let btns = undefined;
let btn_index = 0;
let vid_index = 0;
let no_more_video = false;

function auto() {
    console.log('脚本开始执行。。。。');
    // 获取所有的章节
    let arr = document.querySelectorAll('.posCatalog_level .posCatalog_select .posCatalog_name');

    window.isTick = false;// 判断任务点是否标记完成,默认为未完成
    window.video = undefined;//视频
    let first = true;//控制每一章节video播放只执行一次

    window.setInterval(() => {
        console.log('每10s，监测一次视频状态');
        // 最顶部的iframe
        let topIframe = document.querySelector('#iframe');

        // 判断是否是暂停或首次播放
        if (window.video&&window.video.paused || first) {
            if (currentIndex === 0) {
                player();
            } else {
                // 如果是暂停后的，不需要等加载完
                if(topIframe.onload){
                    player()
                }else{
                    topIframe.onload = () => {
                        player()
                    };
                }
            }
        }

        // 判断视频是否播放完,和任务点是否完成-满足一个就行
        if ((window.isTick)) {
                console.log(`第${currentIndex + 1}章节播放。。。。`);
                // 只需要点击第一章节，其他的自动点击
                arr[currentIndex].click();
                currentIndex++;
                // 重置状态
                video = undefined;
                window.isTick = false;
                no_more_video = false;
                first = true;
                vid_index = 0;
                btn_index = 0;
                btn = 0;
        }

    }, 10000)
}

function detect_video() {
            window.videos = document.querySelector('#iframe').contentWindow.document.querySelectorAll('iframe');
            window.video = window.videos[vid_index].contentWindow.document.getElementById('video_html5_api');
            no_more_video = (!(window.videos[vid_index].parentElement.children[0].getAttribute('aria-label') === '任务点未完成') && (vid_index === window.videos.length - 1));
}

// 获取任务点，和video，并播放视频
function player() {
    // 任务点
    let curset = document.querySelector('.posCatalog_select.posCatalog_active');
    //满足该条件则表示该任务点已完成
    if (curset.children[1].classList.contains('icon_Completed') ) window.isTick = 1;
    
    if (!window.video) {
        //如果没有就跳过
        if (!document.querySelector('#iframe').contentWindow.document.querySelector('iframe')) video = undefined;
        // 不存在则获取
        else {
            detect_video();
        }
    }
    else {
        //如果有视频了就看看有没有更多
            if (!(window.videos[vid_index].parentElement.children[0].getAttribute('aria-label') === '任务点未完成') && vid_index < window.videos.length - 1 ){ 
            //若存在更多视频则获取
            vid_index++;
            window.video = window.videos[vid_index].contentWindow.document.getElementById('video_html5_api')
            }
        
        if (window.videos) if (!(window.videos[vid_index].parentElement.children[0].getAttribute('aria-label'))) {
                detect_video();
        }
        // 存在则判断是否是最新的
        if (window.video.play()) {
            // 上面是最新的话会直接执行。
            first = false;
            detect_video();

        } else {
            // 获取最新的
            window.video = window.videos[vid_index].contentWindow.document.getElementById('video_html5_api');
        }

    }

    if ( !window.isTick && (!window.video || window.video.ended || no_more_video ) ) {
        //获取按钮
        btns = document.querySelectorAll('.prev_ul > li');
        if (btns) {
                if (btn_index < btns.length) {
                    btn_index++;
                    btns[btn_index].click();
                    no_more_video = false;
                } else window.isTick = 1;
            } else window.isTick = 1;
        
    }
    
}

// 执行
auto();
