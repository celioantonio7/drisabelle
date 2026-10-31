// @ts-nocheck
import React, { useEffect, useRef } from 'react';

const FuzzyText: any = ({
  children,
  fontSize = 'clamp(7rem, 22vw, 17rem)',
  fontWeight = 800,
  fontFamily = "'Playfair Display Variable', serif",
  color = '#0b192c',
  colorSplit = 0,
  trigger = 'hover',
  direction = 'horizontal',
  baseIntensity = 0.2,
  hoverIntensity = 0.5,
  fuzzRange = 30,
  sliceSize = 1,
  fps = 60,
  transitionDuration = 0,
  intro = true,
  introDuration = 1400,
  letterSpacing = 0,
  enableHover = true,
  clickEffect = false,
  glitchMode = false,
  glitchInterval = 2000,
  glitchDuration = 200,
  className = '',
}: any = {}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let isCancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const init = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      if (isCancelled) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const computedFontFamily =
        fontFamily === 'inherit'
          ? window.getComputedStyle(canvas).fontFamily || 'sans-serif'
          : fontFamily;

      const fontSizeStr =
        typeof fontSize === 'number' ? `${fontSize}px` : fontSize;
      let numericFontSize: number;
      if (typeof fontSize === 'number') {
        numericFontSize = fontSize;
      } else {
        const temp = document.createElement('span');
        temp.style.fontSize = fontSizeStr;
        temp.style.fontFamily = computedFontFamily;
        temp.style.position = 'absolute';
        temp.style.visibility = 'hidden';
        document.body.appendChild(temp);
        const computedSize = window.getComputedStyle(temp).fontSize;
        numericFontSize = parseFloat(computedSize) || 180;
        document.body.removeChild(temp);
      }

      const text = React.Children.toArray(children).join('');

      const offscreen = document.createElement('canvas');
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;

      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
      offCtx.textBaseline = 'alphabetic';

      const metrics = offCtx.measureText(text);
      const actualLeft = metrics.actualBoundingBoxLeft ?? 0;
      const actualRight =
        (metrics.actualBoundingBoxRight ?? metrics.width) +
        letterSpacing * Math.max(0, text.length - 1);
      const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize;
      const actualDescent =
        metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;

      const textBoundingWidth = Math.ceil(actualLeft + actualRight);
      const tightHeight = Math.ceil(actualAscent + actualDescent);

      const extraWidthBuffer = 20;
      const offscreenWidth = textBoundingWidth + extraWidthBuffer;

      offscreen.width = offscreenWidth;
      offscreen.height = tightHeight;

      const xOffset = extraWidthBuffer / 2;
      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
      offCtx.textBaseline = 'alphabetic';
      offCtx.fillStyle = color;

      if (letterSpacing !== 0) {
        let curX = xOffset + actualLeft;
        for (const ch of text) {
          offCtx.fillText(ch, curX, actualAscent);
          curX += offCtx.measureText(ch).width + letterSpacing;
        }
      } else {
        offCtx.fillText(text, xOffset + actualLeft, actualAscent);
      }

      const horizontalMargin = fuzzRange + 24;
      const verticalMargin =
        direction === 'vertical' || direction === 'both' ? fuzzRange + 16 : 8;

      canvas.width = offscreenWidth + horizontalMargin * 2;
      canvas.height = tightHeight + verticalMargin * 2;

      let isHovering = false;
      let isClicked = false;
      let isGlitching = false;
      let currentIntensity = intro ? Math.max(hoverIntensity, 0.85) : baseIntensity;
      const startTime = performance.now();
      let lastFrameTime = 0;
      const frameInterval = 1000 / Math.max(1, fps);

      let glitchTimer: any = null;
      let glitchEndTimer: any = null;

      if (glitchMode) {
        const scheduleGlitch = () => {
          glitchTimer = setTimeout(() => {
            isGlitching = true;
            glitchEndTimer = setTimeout(() => {
              isGlitching = false;
              scheduleGlitch();
            }, glitchDuration);
          }, glitchInterval);
        };
        scheduleGlitch();
      }

      const isInsideTextArea = (x: number, y: number) => {
        return (
          x >= horizontalMargin &&
          x <= horizontalMargin + offscreenWidth &&
          y >= verticalMargin &&
          y <= verticalMargin + tightHeight
        );
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!enableHover && trigger !== 'hover') return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        isHovering = isInsideTextArea(x, y);
      };

      const handleMouseLeave = () => {
        isHovering = false;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!enableHover && trigger !== 'hover') return;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        if (!touch) return;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;
        isHovering = isInsideTextArea(x, y);
      };

      const handleTouchEnd = () => {
        isHovering = false;
      };

      const handleClick = () => {
        if (!clickEffect && trigger !== 'click') return;
        isClicked = true;
        setTimeout(() => {
          isClicked = false;
        }, 260);
      };

      const step = Math.max(1, Math.round(sliceSize));

      const run = (now: number) => {
        if (isCancelled) return;

        if (now - lastFrameTime >= frameInterval) {
          lastFrameTime = now;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          let targetIntensity = baseIntensity;
          if (intro && now - startTime < introDuration) {
            const p = Math.min(1, (now - startTime) / introDuration);
            const ease = 1 - Math.pow(1 - p, 3);
            targetIntensity =
              hoverIntensity * (1 - ease) + baseIntensity * ease;
          } else if (isGlitching || isClicked) {
            targetIntensity = hoverIntensity;
          } else if ((enableHover || trigger === 'hover') && isHovering) {
            targetIntensity = hoverIntensity;
          } else if (trigger === 'always') {
            targetIntensity = hoverIntensity;
          }

          if (transitionDuration > 0) {
            const alpha = Math.min(1, frameInterval / transitionDuration);
            currentIntensity += (targetIntensity - currentIntensity) * alpha;
          } else {
            currentIntensity = targetIntensity;
          }

          if (direction === 'vertical') {
            for (let col = 0; col < offscreenWidth; col += step) {
              const dy = Math.floor(
                currentIntensity * (Math.random() - 0.5) * fuzzRange,
              );
              ctx.drawImage(
                offscreen,
                col,
                0,
                step,
                tightHeight,
                horizontalMargin + col,
                verticalMargin + dy,
                step,
                tightHeight,
              );
            }
          } else if (direction === 'both') {
            for (let row = 0; row < tightHeight; row += step) {
              const dx = Math.floor(
                currentIntensity * (Math.random() - 0.5) * fuzzRange,
              );
              const dy = Math.floor(
                currentIntensity * (Math.random() - 0.5) * (fuzzRange * 0.35),
              );
              ctx.drawImage(
                offscreen,
                0,
                row,
                offscreenWidth,
                step,
                horizontalMargin + dx,
                verticalMargin + row + dy,
                offscreenWidth,
                step,
              );
            }
          } else {
            for (let row = 0; row < tightHeight; row += step) {
              const dx = Math.floor(
                currentIntensity * (Math.random() - 0.5) * fuzzRange,
              );
              if (colorSplit > 0) {
                ctx.save();
                ctx.globalAlpha = 0.35;
                ctx.drawImage(
                  offscreen,
                  0,
                  row,
                  offscreenWidth,
                  step,
                  horizontalMargin + dx - colorSplit * currentIntensity,
                  verticalMargin + row,
                  offscreenWidth,
                  step,
                );
                ctx.restore();
              }
              ctx.drawImage(
                offscreen,
                0,
                row,
                offscreenWidth,
                step,
                horizontalMargin + dx,
                verticalMargin + row,
                offscreenWidth,
                step,
              );
            }
          }
        }

        animationFrameId = window.requestAnimationFrame(run);
      };

      animationFrameId = window.requestAnimationFrame(run);

      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
      canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
      canvas.addEventListener('touchend', handleTouchEnd);
      canvas.addEventListener('click', handleClick);

      (canvas as any)._cleanupFuzzy = () => {
        window.cancelAnimationFrame(animationFrameId);
        if (glitchTimer) clearTimeout(glitchTimer);
        if (glitchEndTimer) clearTimeout(glitchEndTimer);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
        canvas.removeEventListener('click', handleClick);
      };
    };

    init();

    return () => {
      isCancelled = true;
      window.cancelAnimationFrame(animationFrameId);
      if (canvas && (canvas as any)._cleanupFuzzy) {
        (canvas as any)._cleanupFuzzy();
      }
    };
  }, [
    children,
    fontSize,
    fontWeight,
    fontFamily,
    color,
    colorSplit,
    trigger,
    direction,
    baseIntensity,
    hoverIntensity,
    fuzzRange,
    sliceSize,
    fps,
    transitionDuration,
    intro,
    introDuration,
    letterSpacing,
    enableHover,
    clickEffect,
    glitchMode,
    glitchInterval,
    glitchDuration,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`fuzzy-text-canvas ${className}`.trim()}
      style={{ maxWidth: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
    />
  );
};

export default FuzzyText;

