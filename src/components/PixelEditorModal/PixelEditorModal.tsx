import React, { useState, useRef, useEffect, useCallback } from 'react';
import './PixelEditorModal.css'

const GRID_SIZE = 64;
const PIXEL_SIZE = 5;
const CANVAS_SIZE = GRID_SIZE * PIXEL_SIZE;

interface PixelEditorModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (imageBase64: string) => void;
}

// Helper to initialize a blank white grid
const initializeGrid = () => 
    Array(GRID_SIZE).fill(0).map(() => 
        Array(GRID_SIZE).fill('#FFFFFF')
    );

const DEFAULT_PALETTE = [
    '#000000', '#FFFFFF', '#FF0000', '#FFA500', 
    '#FFFF00', '#008000', '#0000FF', '#4B0082',
    '#EE82EE', '#A52A2A', '#808080', '#C0C0C0',
];


const PixelEditorModal: React.FC<PixelEditorModalProps> = ({ open, onClose, onSave }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [grid, setGrid] = useState<string[][]>(initializeGrid);
    const [currentColor, setCurrentColor] = useState(DEFAULT_PALETTE[0]);
    const [isDrawing, setIsDrawing] = useState(false);
    
    // --- Drawing Functions (Canvas Logic) ---

    const drawGrid = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // Draw current state
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                ctx.fillStyle = grid[r][c];
                ctx.fillRect(c * PIXEL_SIZE, r * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
        }

        // Draw grid lines (optional but helpful)
        ctx.strokeStyle = '#E0E0E0';
        for (let i = 0; i <= GRID_SIZE; i++) {
            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(i * PIXEL_SIZE, 0);
            ctx.lineTo(i * PIXEL_SIZE, CANVAS_SIZE);
            ctx.stroke();

            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, i * PIXEL_SIZE);
            ctx.lineTo(CANVAS_SIZE, i * PIXEL_SIZE);
            ctx.stroke();
        }
    }, [grid]);

    useEffect(() => {
        drawGrid();
    }, [drawGrid]);
    
    // --- Mouse Event Handlers ---

    const getGridCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate grid index
        const col = Math.floor(x / PIXEL_SIZE);
        const row = Math.floor(y / PIXEL_SIZE);
        return { row, col };
    };

    const handlePaint = ({ row, col }: { row: number, col: number }) => {
        if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
            // Update the grid state immutably
            setGrid(prevGrid => {
                const newGrid = prevGrid.map(rowArr => [...rowArr]);
                if (newGrid[row][col] !== currentColor) {
                    newGrid[row][col] = currentColor;
                }
                return newGrid;
            });
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        handlePaint(getGridCoords(e));
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isDrawing) {
            handlePaint(getGridCoords(e));
        }
    };
    
    // --- Save Handler ---

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Export canvas content as Base64 encoded PNG string
        const imageBase64 = canvas.toDataURL('image/png');
        onSave(imageBase64); 
        onClose();
    };
    
    // --- Modal Renderer ---
    if (!open) return null;

    return (
        <div className="editor-modal-overlay">
            <div className="editor-modal-window">
                
                <h2 className="editor-title">Pixel Art Product Image</h2>
                
                <div className="editor-controls">
                    {/* Color Palette */}
                    <div className="palette-container">
                        {DEFAULT_PALETTE.map(color => (
                            <div 
                                key={color}
                                className={`color-swatch ${currentColor === color ? 'selected' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => setCurrentColor(color)}
                            />
                        ))}
                    </div>
                    {/* Current Color Indicator */}
                    <div className="current-color-indicator">
                        Current Color: <span style={{ backgroundColor: currentColor, padding: '0 8px', borderRadius: '4px', border: '1px solid #333' }}>&nbsp;</span>
                    </div>
                </div>

                <div className="canvas-container">
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_SIZE}
                        height={CANVAS_SIZE}
                        onMouseDown={handleMouseDown}
                        onMouseUp={() => setIsDrawing(false)}
                        onMouseLeave={() => setIsDrawing(false)}
                        onMouseMove={handleMouseMove}
                        className="drawing-canvas"
                    />
                </div>
                
                <div className="editor-actions">
                    <button onClick={handleSave} className="save-btn">
                        Save Image
                    </button>
                    <button onClick={onClose} className="cancel-btn">
                        Cancel
                    </button>
                    <button onClick={() => setGrid(initializeGrid())} className="clear-btn">
                        Clear
                    </button>
                </div>
                
            </div>
        </div>
    );
};

export default PixelEditorModal;