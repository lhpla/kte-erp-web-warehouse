const dialogDrag = (app) => {
    app.directive('dialogdrag', {
        // 渲染完毕
        mounted(el) {
            // 弹窗的容器
            const domDrag = el.firstElementChild.firstElementChild
            const domDragBox = document.getElementsByClassName('el-dialog')[0]
            // 可视窗口的宽度
            const clientWidth = document.documentElement.clientWidth
            let width = (domDragBox.style.width.replace('%', "")) * 1
            // 可视窗口的高度
            const clientHeight = document.documentElement.clientHeight
            // 记录坐标
            let domset = {
                x: clientWidth / ((width / 50) * 4), // 默认width 50%
                y: clientHeight * 15 / 100 // 根据 15vh 计算
            }


            // 限制拖动弹窗的 header 才可以移动弹窗
            // const dialogHeader = el.getElementsByClassName('el-dialog__header')[0]
            el.firstElementChild.style.overflow = "hidden"

            // 重新设置上、左距离
            domDrag.style.marginTop = domset.y + 'px'
            domDrag.style.marginLeft = domset.x + 'px'

            // 记录拖拽开始的光标坐标，0 表示没有拖拽
            let start = {
                x: 0,
                y: 0
            }
            // 移动中记录偏移量
            let move = {
                x: 0,
                y: 0
            }

            // 鼠标按下，开始拖拽
            domDrag.onmousedown = (e) => {
                // console.log('zzzzzzz',el.children[0].style);
                // 判断对话框是否重新打开
                if (domDrag.style.marginTop === '15vh') {
                    // 重新打开，设置 domset.y  top
                    domset.y = clientHeight * 15 / 100
                }
                start.x = e.clientX
                start.y = e.clientY
                domDrag.style.cursor = 'move' // 改变光标形状
                // 鼠标拖出浏览器外部的时候会选中文本，需要禁用
                document.body.style.userSelect = 'none'
                // 使用 document 的 mousemove ，这样鼠标脱离 header 区域还是可以正常拖动（贴着窗口边缘移动）
                // 鼠标移动，实时跟踪
                document.addEventListener('mousemove', dia_mousemove)
                // 鼠标抬起，结束拖拽，once: 只执行一次
                document.addEventListener('mouseup', dia_mouseup, {
                    once: true
                })
            }

            // 鼠标移动，实时跟踪
            function dia_mousemove(e) {
                if (start.x === 0) { // 不是拖拽状态
                    return
                }
                move.x = e.clientX - start.x
                move.y = e.clientY - start.y
                // 弹窗 左、上、右、下 到窗口边缘的距离
                let left = domset.x + move.x,
                    top = domset.y + move.y
                let right = left + domDrag.clientWidth,
                    bottom = top + domDrag.clientHeight

                if (left <= 0) {
                    domDrag.style.marginLeft = '0px'
                } else if (right >= clientWidth) {
                    domDrag.style.marginLeft = (clientWidth - domDrag.clientWidth) + 'px'
                } else {
                    domDrag.style.marginLeft = left + 'px'
                }
                if (top <= 0) {
                    domDrag.style.marginTop = '0px'
                } else if (bottom >= clientHeight) {
                    domDrag.style.marginTop = (clientHeight - domDrag.clientHeight) + 'px'
                } else {
                    domDrag.style.marginTop = top + 'px'
                }
            }
            // 鼠标抬起，结束拖拽
            function dia_mouseup(e) {
                move.x = e.clientX - start.x
                move.y = e.clientY - start.y
                let left = domset.x + move.x,
                    top = domset.y + move.y
                let right = left + domDrag.clientWidth,
                    bottom = top + domDrag.clientHeight

                domDrag.style.cursor = '' // 恢复光标形状
                document.body.style.userSelect = 'text' // 恢复body可选中
                // 结束拖拽
                start.x = 0
                if (left <= 0) {
                    domDrag.style.marginLeft = '0px'
                    domset.x = 0
                } else if (right >= clientWidth) {
                    domDrag.style.marginLeft = (clientWidth - domDrag.clientWidth) + 'px'
                    domset.x = clientWidth - domDrag.clientWidth
                } else {
                    domDrag.style.marginLeft = left + 'px'
                    domset.x = left
                }
                if (top <= 0) {
                    domDrag.style.marginTop = '0px'
                    domset.y = 0
                } else if (bottom >= clientHeight) {
                    domDrag.style.marginTop = (clientHeight - domDrag.clientHeight) + 'px'
                    domset.y = clientHeight - domDrag.clientHeight
                } else {
                    domDrag.style.marginTop = top + 'px'
                    domset.y = top
                }
                // 结束拖拽
                document.removeEventListener('mousemove', dia_mousemove)
            }
        }
    })
}
export default dialogDrag