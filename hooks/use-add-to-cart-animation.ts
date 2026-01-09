'use client';

import { useCallback } from 'react';

interface AnimationOptions {
  onComplete?: () => void;
}

export function useAddToCartAnimation() {
  const triggerAnimation = useCallback((
    startElement: HTMLElement,
    endElement: HTMLElement,
    options?: AnimationOptions
  ) => {
    // 获取起始位置和目标位置
    const startRect = startElement.getBoundingClientRect();
    const endRect = endElement.getBoundingClientRect();

    // 创建动画元素
    const flyingElement = document.createElement('div');
    flyingElement.className = 'flying-cart-item';
    flyingElement.style.cssText = `
      position: fixed;
      left: ${startRect.left + startRect.width / 2}px;
      top: ${startRect.top + startRect.height / 2}px;
      width: 40px;
      height: 40px;
      background: #D7001D;
      border-radius: 50%;
      z-index: 9999;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    // 添加购物车图标（使用 Lucide 的购物车图标 SVG）
    const icon = document.createElement('div');
    icon.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="8" cy="21" r="1"></circle>
        <circle cx="19" cy="21" r="1"></circle>
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
      </svg>
    `;
    icon.style.display = 'flex';
    icon.style.alignItems = 'center';
    icon.style.justifyContent = 'center';
    flyingElement.appendChild(icon);

    document.body.appendChild(flyingElement);

    // 计算动画参数
    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const endX = endRect.left + endRect.width / 2;
    const endY = endRect.top + endRect.height / 2;

    // 抛物线路径：使用二次贝塞尔曲线
    const controlX = (startX + endX) / 2;
    const controlY = Math.min(startY, endY) - 100; // 向上弯曲

    // 使用 requestAnimationFrame 实现平滑动画
    const duration = 600; // 动画时长（毫秒）
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 使用缓动函数（ease-out）
      const easeOut = 1 - Math.pow(1 - progress, 3);

      // 计算当前位置（二次贝塞尔曲线）
      const x = (1 - easeOut) * (1 - easeOut) * startX + 
                2 * (1 - easeOut) * easeOut * controlX + 
                easeOut * easeOut * endX;
      const y = (1 - easeOut) * (1 - easeOut) * startY + 
                2 * (1 - easeOut) * easeOut * controlY + 
                easeOut * easeOut * endY;

      // 更新位置
      flyingElement.style.left = `${x}px`;
      flyingElement.style.top = `${y}px`;

      // 缩放效果（开始时大，结束时小）
      const scale = 1 - easeOut * 0.5;
      flyingElement.style.transform = `scale(${scale})`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 动画完成
        document.body.removeChild(flyingElement);
        if (options?.onComplete) {
          options.onComplete();
        }
      }
    };

    // 触发动画
    requestAnimationFrame(animate);
  }, []);

  return { triggerAnimation };
}
