/* Blessing Catcher visual hotfix: raises the catch tool so it sits in the character's hands. */
(() => {
    const TOOL_Y_OFFSET = -34;
    const isGameCanvas = ctx => ctx && ctx.canvas && ctx.canvas.id === "gameCanvas";
    const isLowerGameplayArea = (ctx, y) => isGameCanvas(ctx) && y > ctx.canvas.clientHeight * 0.62;
    const isCatchToolShape = (ctx, x, y, w, h) => {
        return isLowerGameplayArea(ctx, y) && w >= 70 && w <= 240 && h > 4 && h <= 42;
    };

    const originalRoundRect = CanvasRenderingContext2D.prototype.roundRect;
    if (originalRoundRect && !CanvasRenderingContext2D.prototype.__toolRaiseRoundRectPatched) {
        CanvasRenderingContext2D.prototype.__toolRaiseRoundRectPatched = true;
        CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
            if (isCatchToolShape(this, x, y, w, h)) y += TOOL_Y_OFFSET;
            return originalRoundRect.call(this, x, y, w, h, r);
        };
    }

    const originalFillRect = CanvasRenderingContext2D.prototype.fillRect;
    if (originalFillRect && !CanvasRenderingContext2D.prototype.__toolRaiseFillRectPatched) {
        CanvasRenderingContext2D.prototype.__toolRaiseFillRectPatched = true;
        CanvasRenderingContext2D.prototype.fillRect = function(x, y, w, h) {
            if (isCatchToolShape(this, x, y, w, h)) y += TOOL_Y_OFFSET;
            return originalFillRect.call(this, x, y, w, h);
        };
    }

    const originalStrokeRect = CanvasRenderingContext2D.prototype.strokeRect;
    if (originalStrokeRect && !CanvasRenderingContext2D.prototype.__toolRaiseStrokeRectPatched) {
        CanvasRenderingContext2D.prototype.__toolRaiseStrokeRectPatched = true;
        CanvasRenderingContext2D.prototype.strokeRect = function(x, y, w, h) {
            if (isCatchToolShape(this, x, y, w, h)) y += TOOL_Y_OFFSET;
            return originalStrokeRect.call(this, x, y, w, h);
        };
    }
})();
