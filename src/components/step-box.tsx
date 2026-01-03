import {
    type BoxOptions,
    BoxRenderable,
    OptimizedBuffer,
    type RenderContext,
    RGBA,
} from '@opentui/core';
import { extend } from '@opentui/react';

class ConsoleButtonRenderable extends BoxRenderable {
    private _label: string;
    private _labelColor: string;
    private _icon: string;
    private _iconColor: string;
    private _isLast: boolean;
    private _isFocused: boolean;
    private _bottomBorder: boolean;

    constructor(
        ctx: RenderContext,
        options: BoxOptions & {
            label?: string;
            isLast?: boolean;
            labelColor?: string;
            icon?: string;
            iconColor?: string;
            isFocused?: boolean;
            bottomBorder?: boolean;
        }
    ) {
        super(ctx, {
            ...options,
            border: false,
            shouldFill: false,
        });

        const {
            label = 'Button',
            labelColor = '#ffffff',
            icon = '▪',
            iconColor = '#ffffff',
            isLast = false,
            isFocused = false,
            bottomBorder = true,
        } = options;

        this._label = label;
        this._labelColor = labelColor;
        this._icon = icon;
        this._iconColor = iconColor;
        this._isLast = isLast;
        this._isFocused = isFocused;
        this._bottomBorder = bottomBorder;
    }

    private updateProperty<T>(currentValue: T, newValue: T, setter: () => void): void {
        if (currentValue !== newValue) {
            setter();
            this.requestRender();
        }
    }

    public override renderSelf(buffer: OptimizedBuffer): void {
        const topOffset = 0;

        this.drawBackground(buffer);
        this.drawCustomBorder(buffer, topOffset, this._isFocused);
    }

    private drawBackground(buffer: OptimizedBuffer) {
        const color = this.backgroundColor;

        for (let row = 0; row < this.height; row++) {
            buffer.drawText(' '.repeat(this.width), this.x, this.y + row, color);
        }
    }

    private drawCustomBorder(buffer: OptimizedBuffer, topOffset: number, focused: boolean) {
        const x = this.x;
        const y = this.y;
        const h = this.height;

        // top border (shifted)
        buffer.drawText(this._icon, x, y + topOffset, RGBA.fromHex(this._iconColor));

        // left border (starts lower)
        for (let i = topOffset + 1; i < h - 1; i++) {
            buffer.drawText(focused ? '┃' : '│', x, y + i, RGBA.fromHex(this._labelColor));
        }

        // bottom left corner shifted
        buffer.drawText(
            this._isLast ? (focused ? '┗' : '└') : focused ? '┃' : '│',
            x,
            y + h - 1,
            RGBA.fromHex(this._labelColor)
        );

        // bottom line border only on focused
        if (this._isLast && this._bottomBorder) {
            buffer.drawText(
                '─'.repeat(this.width - 2),
                x + 1,
                y + h - 1,
                RGBA.fromHex(this._labelColor)
            );
        }
    }

    get label(): string {
        return this._label;
    }

    set label(value: string) {
        this._label = value;
        this.requestRender();
    }

    get isLast(): boolean {
        return this._isLast;
    }

    set isLast(value: boolean) {
        this.updateProperty(this._isLast, value, () => {
            this._isLast = value;
        });
    }

    get isFocused(): boolean {
        return this._isFocused;
    }

    set isFocused(value: boolean) {
        this.updateProperty(this._isFocused, value, () => {
            this._isFocused = value;
        });
    }

    get labelColor(): string {
        return this._labelColor;
    }

    set labelColor(value: string) {
        this.updateProperty(this._labelColor, value, () => {
            this._labelColor = value;
        });
    }

    get icon(): string {
        return this._icon;
    }

    set icon(value: string) {
        this.updateProperty(this._icon, value, () => {
            this._icon = value;
        });
    }

    get iconColor(): string {
        return this._iconColor;
    }

    set iconColor(value: string) {
        this.updateProperty(this._iconColor, value, () => {
            this._iconColor = value;
        });
    }
}

declare module '@opentui/react' {
    interface OpenTUIComponents {
        consoleButton: typeof ConsoleButtonRenderable;
    }
}

export function registerConsoleButton() {
    extend({
        consoleButton: ConsoleButtonRenderable,
    });
}
