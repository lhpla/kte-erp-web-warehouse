/*
 * @Author: 魏君粮e 魏君粮
 * @Date: 2022-05-16 14:37:42
 * @LastEditors: 魏君粮e 魏君粮
 * @LastEditTime: 2022-05-18 10:51:55
 * @FilePath: \kte-erp-web-warehouse\src\compositionApi\useShowSearchBtn.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  ref,
  onMounted,
  onUnmounted,
  nextTick,
  watch,
  onActivated,
  onDeactivated
} from 'vue'

// 判定表单是否展示合并的hooks 

export const useShowSearchBtn = () => {
  const searchPanelWidth = ref(0)
  const showSearchBtn = ref(true)

  const getPanelWidth = () => {
    nextTick(() => {
      searchPanelWidth.value = window
        .getComputedStyle(document.getElementById('SearchPanel'))
        .width.replace('px', '')
    })
  }
  onMounted(() => {
    window.addEventListener('resize', getPanelWidth)
    getPanelWidth()
  })
  onActivated(() => {
    getPanelWidth()
    window.addEventListener('resize', getPanelWidth)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', getPanelWidth)
  })
  onDeactivated(() => {
    window.removeEventListener('resize', getPanelWidth)
  })



  watch(
    () => searchPanelWidth.value,
    (val) => {
      if (val) {
        nextTick(() => {
          let itemList = Array.from(
            document.getElementsByClassName('SearchPanel-form-item')
          )
          let width = 0
          itemList.map((item) => {
            width += Number(
              window.getComputedStyle(item).width.replace('px', '')
            )
          })
          if (width >= val) showSearchBtn.value = true
          else showSearchBtn.value = false
        })
      }
    }, {
      immediate: true
    }
  )
  return {
    showSearchBtn,
  }
}
