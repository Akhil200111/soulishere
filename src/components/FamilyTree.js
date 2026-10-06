'use client';

import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { 
    FaSearch, 
    FaSearchPlus, 
    FaSearchMinus, 
    FaRedo, 
    FaTimes, 
    FaCrown, 
    FaHandPaper, 
    FaCrosshairs,
    FaHeart,
    FaUser,
    FaCalendarAlt,
    FaBookOpen,
    FaLeaf,
    FaExclamationTriangle
} from 'react-icons/fa';
import calculateFamilyTreeLayout from '@/utils/familyTreeLayout';

/**
 * Botanical Leaf & Blossom SVG Accent Component around circular nodes
 */
function BotanicalLeaves({ isMemorialSubject = false, position = 'right' }) {
    if (isMemorialSubject) {
        return (
            <svg 
                width="64" 
                height="64" 
                viewBox="0 0 64 64" 
                style={{ 
                    position: 'absolute', 
                    top: '-12px', 
                    left: '-16px', 
                    pointerEvents: 'none', 
                    zIndex: 4,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))' 
                }}
            >
                <path d="M 32 48 C 24 38 14 30 10 18 C 8 12 12 6 18 8 C 24 10 26 18 28 24" fill="none" stroke="#6B8E23" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 16 32 C 8 26 6 16 12 12 C 18 8 22 18 20 28" fill="#7A9A60" stroke="#556B2F" strokeWidth="0.8" />
                <path d="M 24 40 C 14 38 10 28 16 22 C 22 16 26 28 26 36" fill="#8A9A86" stroke="#556B2F" strokeWidth="0.8" />
                <path d="M 28 20 C 22 12 24 4 30 6 C 36 8 32 18 28 20" fill="#7A9A60" opacity="0.9" />

                <circle cx="16" cy="16" r="5" fill="#FFFDF9" stroke="#E6D3B8" strokeWidth="0.8" />
                <circle cx="16" cy="16" r="2" fill="#D4AF37" />
                <circle cx="28" cy="28" r="4" fill="#FFFDF9" stroke="#E6D3B8" strokeWidth="0.8" />
                <circle cx="28" cy="28" r="1.5" fill="#D4AF37" />
            </svg>
        );
    }

    return (
        <svg 
            width="48" 
            height="52" 
            viewBox="0 0 48 52" 
            style={{ 
                position: 'absolute', 
                top: position === 'right' ? '12px' : 'auto', 
                bottom: position === 'right' ? 'auto' : '16px',
                right: position === 'right' ? '-14px' : 'auto',
                left: position === 'right' ? 'auto' : '-14px',
                transform: position === 'right' ? 'rotate(15deg)' : 'rotate(-135deg)',
                pointerEvents: 'none', 
                zIndex: 3,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' 
            }}
        >
            <path d="M 12 44 C 18 32 28 22 36 10 C 38 7 42 6 44 10 C 44 14 38 20 30 28" fill="none" stroke="#7A9A60" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 20 34 C 12 30 10 20 16 18 C 22 16 24 26 22 32" fill="#8B9F74" stroke="#556B2F" strokeWidth="0.6" />
            <path d="M 28 24 C 22 16 26 8 32 10 C 38 12 34 22 30 24" fill="#6B8E23" stroke="#4B6319" strokeWidth="0.6" />
            <path d="M 34 16 C 30 8 36 2 40 4 C 44 6 40 14 36 16" fill="#A3B493" opacity="0.85" />
            <circle cx="22" cy="28" r="4.2" fill="#FAF7F0" stroke="#E2D6C3" strokeWidth="0.7" />
            <circle cx="22" cy="28" r="1.8" fill="#D4AF37" />
        </svg>
    );
}

function FamilyTree({ familyMembers = [], memorial = null }) {
    const [selectedMember, setSelectedMember] = useState(null);
    const [hoveredNodeId, setHoveredNodeId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [zoomLevel, setZoomLevel] = useState(1);

    // Pan / Drag State
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
    const [hasDragged, setHasDragged] = useState(false);

    const containerRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedMember(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Layout Engine Calculation
    const layout = useMemo(() => {
        return calculateFamilyTreeLayout(familyMembers, memorial);
    }, [familyMembers, memorial]);

    const { nodes, edges, generationBanners, disconnectedNodes, bounds, mainPersonId } = layout;

    const highlightedNodeIds = useMemo(() => {
        if (!searchTerm.trim()) return new Set();
        const term = searchTerm.toLowerCase().trim();
        const matches = new Set();
        nodes.forEach(node => {
            if (
                (node.name && node.name.toLowerCase().includes(term)) ||
                (node.relationship && node.relationship.toLowerCase().includes(term)) ||
                (node.dates && node.dates.toLowerCase().includes(term))
            ) {
                matches.add(node.id);
            }
        });
        return matches;
    }, [nodes, searchTerm]);

    const activeConnectionKeys = useMemo(() => {
        if (!hoveredNodeId) return new Set();
        const active = new Set();

        edges.partner.forEach(e => {
            if (e.fromId === hoveredNodeId || e.toId === hoveredNodeId) active.add(e.id);
        });

        edges.familyJunctions.forEach(fj => {
            const group = layout.partnerGroups.find(g => g.id === fj.groupId);
            const isParent = group && group.memberIds.includes(hoveredNodeId);
            const isChild = fj.childDrops.some(cd => cd.childId === hoveredNodeId);

            if (isParent || isChild) {
                active.add(fj.id);
            }
        });

        edges.ancestor.forEach(e => {
            if (e.fromId === hoveredNodeId || e.toId === hoveredNodeId) active.add(e.id);
        });

        return active;
    }, [hoveredNodeId, edges, layout.partnerGroups]);

    // Auto-fit view logic: calculates scale & scroll position so ALL nodes are fully visible initially
    const fitToView = useCallback(() => {
        if (!containerRef.current || !nodes || nodes.length === 0) return;

        const containerWidth = containerRef.current.clientWidth || 900;
        const containerHeight = containerRef.current.clientHeight || 680;

        const nodeSpanWidth = Math.max(bounds.maxX - bounds.minX + 340, 650);
        const nodeSpanHeight = Math.max(bounds.maxY - bounds.minY + 360, 520);

        const scaleX = (containerWidth - 40) / nodeSpanWidth;
        const scaleY = (containerHeight - 40) / nodeSpanHeight;

        const autoScale = Math.min(scaleX, scaleY);
        // Clamp fit scale so all nodes are shown initially while keeping text readable
        const initialZoom = Math.min(Math.max(autoScale, 0.45), 1.0);

        setZoomLevel(initialZoom);

        setTimeout(() => {
            if (!containerRef.current) return;
            const paddingX = 350;
            const paddingY = 220;
            const offsetX = Math.abs(bounds.minX) + paddingX;
            const offsetY = Math.abs(bounds.minY) + paddingY;

            const treeCenterX = ((bounds.minX + bounds.maxX) / 2) + offsetX;
            const treeCenterY = ((bounds.minY + bounds.maxY) / 2) + offsetY;

            const targetScrollLeft = treeCenterX * initialZoom - containerWidth / 2;
            const targetScrollTop = treeCenterY * initialZoom - containerHeight / 2;

            containerRef.current.scrollTo({
                left: Math.max(0, targetScrollLeft),
                top: Math.max(0, targetScrollTop),
                behavior: 'smooth'
            });
        }, 60);
    }, [bounds, nodes]);

    // Initial state trigger: automatically fit all nodes in view when lineage tree is opened
    useEffect(() => {
        const timer = setTimeout(fitToView, 120);
        return () => clearTimeout(timer);
    }, [fitToView]);

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.6));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.45));
    const handleZoomReset = () => {
        fitToView();
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                if (e.deltaY < 0) {
                    setZoomLevel(prev => Math.min(prev + 0.1, 1.6));
                } else {
                    setZoomLevel(prev => Math.max(prev - 0.1, 0.45));
                }
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, []);

    const handleMouseDown = (e) => {
        if (e.button !== 0) return;
        if (e.target.closest('button, input, a, select')) return;

        setIsDragging(true);
        setHasDragged(false);
        setDragStart({
            x: e.clientX,
            y: e.clientY,
            scrollLeft: containerRef.current ? containerRef.current.scrollLeft : 0,
            scrollTop: containerRef.current ? containerRef.current.scrollTop : 0
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current) return;
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;

        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            setHasDragged(true);
        }

        containerRef.current.scrollLeft = dragStart.scrollLeft - dx;
        containerRef.current.scrollTop = dragStart.scrollTop - dy;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e) => {
        if (e.touches.length !== 1) return;
        if (e.target.closest('button, input, a, select')) return;

        const touch = e.touches[0];
        setIsDragging(true);
        setHasDragged(false);
        setDragStart({
            x: touch.clientX,
            y: touch.clientY,
            scrollLeft: containerRef.current ? containerRef.current.scrollLeft : 0,
            scrollTop: containerRef.current ? containerRef.current.scrollTop : 0
        });
    };

    const handleTouchMove = (e) => {
        if (!isDragging || !containerRef.current || e.touches.length !== 1) return;
        const touch = e.touches[0];
        const dx = touch.clientX - dragStart.x;
        const dy = touch.clientY - dragStart.y;

        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            setHasDragged(true);
        }

        containerRef.current.scrollLeft = dragStart.scrollLeft - dx;
        containerRef.current.scrollTop = dragStart.scrollTop - dy;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const paddingX = 350;
    const paddingY = 220;
    const totalCanvasWidth = bounds.canvasWidth + paddingX * 2;
    const totalCanvasHeight = bounds.canvasHeight + paddingY * 2;
    const offsetX = Math.abs(bounds.minX) + paddingX;
    const offsetY = Math.abs(bounds.minY) + paddingY;

    if (!nodes || nodes.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#FDFBF7', borderRadius: '24px', border: '1.5px solid #E8DFD1' }}>
                <FaLeaf style={{ fontSize: '3rem', color: '#C48F95', marginBottom: '1rem' }} />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: '#5C4A42', margin: '0 0 0.5rem 0' }}>Family Memorial Lineage</h3>
                <p style={{ color: '#8C7B70', margin: 0 }}>No family lineage records added to this memorial yet.</p>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', width: '100%', fontFamily: "'Poppins', sans-serif" }}>
            
            {/* Header Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: '#4A3E54', margin: 0, fontWeight: '700', letterSpacing: '-0.3px' }}>
                        Family & Memorial Lineage
                    </h2>
                    <p style={{ margin: '0.2rem 0 0 0', color: '#7A6B82', fontSize: '0.9rem' }}>
                        Connected family graph architecture with metallic gold connection links. Click any member to view details.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', minWidth: '200px' }}>
                        <FaSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#A39C95', fontSize: '0.85rem' }} />
                        <input
                            type="text"
                            placeholder="Search relative..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.55rem 0.8rem 0.55rem 2.3rem',
                                borderRadius: '50px',
                                border: '1px solid #D8CBB7',
                                outline: 'none',
                                fontSize: '0.85rem',
                                backgroundColor: '#FFFFFF',
                                color: '#4A3E54',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                            }}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#A39C95' }}
                            >
                                <FaTimes style={{ fontSize: '0.8rem' }} />
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid #D8CBB7', borderRadius: '50px', padding: '0.2rem 0.3rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                        <button
                            onClick={handleZoomOut}
                            title="Zoom Out"
                            style={{ padding: '0.45rem 0.7rem', background: 'none', border: 'none', cursor: 'pointer', color: '#5C4A42' }}
                        >
                            <FaSearchMinus />
                        </button>
                        <span style={{ fontSize: '0.82rem', color: '#706862', padding: '0 0.3rem', minWidth: '42px', textAlign: 'center', fontWeight: '600' }}>
                            {Math.round(zoomLevel * 100)}%
                        </span>
                        <button
                            onClick={handleZoomIn}
                            title="Zoom In"
                            style={{ padding: '0.45rem 0.7rem', background: 'none', border: 'none', cursor: 'pointer', color: '#5C4A42' }}
                        >
                            <FaSearchPlus />
                        </button>
                        <button
                            onClick={fitToView}
                            title="Fit / Center View"
                            style={{ padding: '0.45rem 0.7rem', background: 'none', border: 'none', cursor: 'pointer', color: '#5C4A42', borderLeft: '1px solid #E2D9CC' }}
                        >
                            <FaCrosshairs />
                        </button>
                        <button
                            onClick={handleZoomReset}
                            title="Reset View"
                            style={{ padding: '0.45rem 0.7rem', background: 'none', border: 'none', cursor: 'pointer', color: '#C48F95', borderLeft: '1px solid #E2D9CC' }}
                        >
                            <FaRedo />
                        </button>
                    </div>
                </div>
            </div>

            {/* Interactive Canvas Viewport Container */}
            <div 
                ref={containerRef}
                className="hide-scrollbar"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '680px',
                    overflow: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    backgroundImage: `
                        radial-gradient(ellipse 90% 60% at 50% 10%, rgba(255, 255, 255, 0.65) 0%, transparent 80%),
                        radial-gradient(rgba(175, 130, 205, 0.18) 1px, transparent 1px)
                    `,
                    backgroundSize: '100% 100%, 22px 22px',
                    borderRadius: '24px',
                    border: '1.5px solid rgba(212, 182, 235, 0.45)',
                    boxShadow: '0 15px 35px rgba(115, 80, 145, 0.06)',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    touchAction: 'pan-x pan-y'
                }}
            >
                {/* Floating Helper Badge */}
                <div style={{
                    position: 'sticky',
                    top: '16px',
                    left: '16px',
                    zIndex: 25,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'rgba(74, 62, 84, 0.88)',
                    color: '#FFFDF9',
                    padding: '0.4rem 0.95rem',
                    borderRadius: '50px',
                    fontSize: '0.78rem',
                    fontWeight: '500',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                    pointerEvents: 'none',
                    float: 'left'
                }}>
                    <FaHandPaper style={{ fontSize: '0.75rem', color: '#E8C88B' }} /> Drag canvas to pan • Click node for details
                </div>

                {/* Scaled Inner Canvas Layer */}
                <div style={{
                    width: `${totalCanvasWidth}px`,
                    height: `${totalCanvasHeight}px`,
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'top left',
                    transition: isDragging ? 'none' : 'transform 0.22s ease-out',
                    position: 'relative'
                }}>

                    {/* SVG Connector Layer */}
                    <svg
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                            zIndex: 3
                        }}
                    >
                        <defs>
                            {/* Warm Golden-Brown Line Gradient */}
                            <linearGradient id="goldBranchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#D4A755" />
                                <stop offset="50%" stopColor="#B8860B" />
                                <stop offset="100%" stopColor="#8C5A18" />
                            </linearGradient>

                            {/* Warm Golden-Brown Leaf Shading Gradient (matching reference image!) */}
                            <linearGradient id="goldLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#F5E4B3" />
                                <stop offset="40%" stopColor="#C8963E" />
                                <stop offset="100%" stopColor="#875B1F" />
                            </linearGradient>

                            {/* Elegant 3-Leaf Floral Detail Symbol (matching reference image!) */}
                            <g id="golden3LeafFlourish">
                                {/* Entry stem curve */}
                                <path d="M -5 0 C -3 0, -1 0, 0 0" fill="none" stroke="url(#goldBranchGrad)" strokeWidth="1.4" strokeLinecap="round" />
                                
                                {/* Central Leaf */}
                                <path d="M 0 0 C 3 -2.5, 9 -2.5, 12 0 C 9 2.5, 3 2.5, 0 0 Z" fill="url(#goldLeafGrad)" stroke="#7A5217" strokeWidth="0.5" />
                                <path d="M 0 0 Q 6 0 10 0" fill="none" stroke="#7A5217" strokeWidth="0.4" opacity="0.6" />

                                {/* Top Leaf */}
                                <path d="M -1 0 C 1.5 -4.5, 6.5 -7.5, 10 -5 C 7.5 -1.5, 3 -1, -1 0 Z" fill="url(#goldLeafGrad)" stroke="#7A5217" strokeWidth="0.5" />
                                <path d="M -1 0 Q 4 -3 8 -4.5" fill="none" stroke="#7A5217" strokeWidth="0.4" opacity="0.6" />

                                {/* Bottom Leaf */}
                                <path d="M -1 0 C 1.5 4.5, 6.5 7.5, 10 5 C 7.5 1.5, 3 1, -1 0 Z" fill="url(#goldLeafGrad)" stroke="#7A5217" strokeWidth="0.5" />
                                <path d="M -1 0 Q 4 3 8 4.5" fill="none" stroke="#7A5217" strokeWidth="0.4" opacity="0.6" />

                                {/* Delicate Dot at leaf join */}
                                <circle cx="0" cy="0" r="1.3" fill="#B8860B" stroke="#7A5217" strokeWidth="0.4" />
                            </g>

                            {/* Terminal Golden Circle Dot Cap */}
                            <g id="goldenDotCap">
                                <circle cx="0" cy="0" r="2.3" fill="url(#goldBranchGrad)" stroke="#7A5217" strokeWidth="0.6" />
                            </g>
                        </defs>

                        {/* 1. Partner Horizontal Organic Connectors & Heart Medallions */}
                        {edges.partner.map(edge => {
                            const hX = edge.heartX + offsetX;
                            const hY = edge.heartY + offsetY;
                            const sX = edge.startX + offsetX;
                            const sY = edge.startY + offsetY;
                            const eX = edge.endX + offsetX;
                            const eY = edge.endY + offsetY;
                            const isActive = activeConnectionKeys.has(edge.id);
                            const strokeW = isActive ? '2.2' : '1.4';

                            const leftCurveData = `M ${sX} ${sY} Q ${(sX + hX - 16) / 2} ${sY - 8} ${hX - 16} ${hY}`;
                            const rightCurveData = `M ${hX + 16} ${hY} Q ${(hX + 16 + eX) / 2} ${hY + 8} ${eX} ${eY}`;

                            return (
                                <g key={edge.id} opacity={hoveredNodeId && !isActive ? 0.35 : 1}>
                                    {/* Terminal Golden Dots at Both Spouse Node Boundaries */}
                                    <use href="#goldenDotCap" x={sX} y={sY} />
                                    <use href="#goldenDotCap" x={eX} y={eY} />

                                    {/* Left Organic Curved Path */}
                                    <path
                                        d={leftCurveData}
                                        fill="none"
                                        stroke="url(#goldBranchGrad)"
                                        strokeWidth={strokeW}
                                        strokeLinecap="round"
                                    />

                                    {/* Right Organic Curved Path */}
                                    <path
                                        d={rightCurveData}
                                        fill="none"
                                        stroke="url(#goldBranchGrad)"
                                        strokeWidth={strokeW}
                                        strokeLinecap="round"
                                    />

                                    {/* 3-Leaf Flourishes Flanking Heart Medallion & Node Connections */}
                                    <use href="#golden3LeafFlourish" x={sX + 16} y={sY} transform={`rotate(180, ${sX + 16}, ${sY})`} />
                                    <use href="#golden3LeafFlourish" x={hX - 16} y={hY} transform={`rotate(0, ${hX - 16}, ${hY})`} />
                                    <use href="#golden3LeafFlourish" x={hX + 16} y={hY} transform={`rotate(180, ${hX + 16}, ${hY})`} />
                                    <use href="#golden3LeafFlourish" x={eX - 16} y={eY} transform={`rotate(0, ${eX - 16}, ${eY})`} />

                                    {/* Center Heart Medallion */}
                                    <circle cx={hX} cy={hY} r="11" fill="#FAF6F0" stroke="#B8860B" strokeWidth="1.2" />
                                    <path 
                                        d={`M ${hX} ${hY + 3.2} C ${hX - 4} ${hY - 1}, ${hX - 4} ${hY - 4}, ${hX} ${hY - 2.2} C ${hX + 4} ${hY - 4}, ${hX + 4} ${hY - 1}, ${hX} ${hY + 3.2} Z`} 
                                        fill="#C48F95" 
                                    />
                                </g>
                            );
                        })}

                        {/* 2. Family Junction Edges (Organic Curved Stems, Bars, and Child Drops) */}
                        {edges.familyJunctions.map(fj => {
                            const stemStartX = fj.stemStartX + offsetX;
                            const stemStartY = fj.stemStartY + offsetY;
                            const junctionY = fj.junctionY + offsetY;
                            const barStartX = fj.barStartX + offsetX;
                            const barEndX = fj.barEndX + offsetX;
                            const isActive = activeConnectionKeys.has(fj.id);
                            const strokeW = isActive ? '2.2' : '1.4';

                            const stemDy = junctionY - stemStartY;
                            const stemPathData = `M ${stemStartX} ${stemStartY} C ${stemStartX + 10} ${stemStartY + stemDy * 0.35}, ${stemStartX - 10} ${stemStartY + stemDy * 0.7}, ${stemStartX} ${junctionY}`;

                            const barWidth = barEndX - barStartX;
                            const barPathData = `M ${barStartX} ${junctionY} C ${barStartX + barWidth * 0.3} ${junctionY - 6}, ${barStartX + barWidth * 0.7} ${junctionY + 6}, ${barEndX} ${junctionY}`;

                            return (
                                <g key={fj.id} opacity={hoveredNodeId && !isActive ? 0.35 : 1}>
                                    {/* Dot cap at Stem origin */}
                                    <use href="#goldenDotCap" x={stemStartX} y={stemStartY} />

                                    {/* Organic Curved Stem from Partner/Parent Group */}
                                    <path
                                        d={stemPathData}
                                        fill="none"
                                        stroke="url(#goldBranchGrad)"
                                        strokeWidth={strokeW}
                                        strokeLinecap="round"
                                    />

                                    {/* Horizontal Organic Arch Bar */}
                                    {fj.hasHorizontalBar && (
                                        <g>
                                            <use href="#goldenDotCap" x={barStartX} y={junctionY} />
                                            <use href="#goldenDotCap" x={barEndX} y={junctionY} />

                                            <path
                                                d={barPathData}
                                                fill="none"
                                                stroke="url(#goldBranchGrad)"
                                                strokeWidth={strokeW}
                                                strokeLinecap="round"
                                            />
                                        </g>
                                    )}

                                    {/* 3-Leaf Flourish Motif at Central Junction Split */}
                                    <use
                                        href="#golden3LeafFlourish"
                                        x={stemStartX}
                                        y={junctionY}
                                        transform={`rotate(90, ${stemStartX}, ${junctionY})`}
                                    />

                                    {/* Organic Curved Drops to Each Child Node */}
                                    {fj.childDrops.map(cd => {
                                        const cTargetX = cd.targetX + offsetX;
                                        const cTargetY = cd.targetY + offsetY;

                                        const dropDy = cTargetY - junctionY;
                                        const isLeft = cTargetX < stemStartX;
                                        const curveOffset = isLeft ? -8 : 8;
                                        const dropPathData = `M ${cTargetX} ${junctionY} C ${cTargetX + curveOffset} ${junctionY + dropDy * 0.35}, ${cTargetX - curveOffset} ${junctionY + dropDy * 0.7}, ${cTargetX} ${cTargetY}`;

                                        return (
                                            <g key={`cd_${cd.childId}`}>
                                                {/* Start Cap at Junction Bar */}
                                                <use href="#goldenDotCap" x={cTargetX} y={junctionY} />

                                                {/* Smooth Organic Child Drop Curve */}
                                                <path
                                                    d={dropPathData}
                                                    fill="none"
                                                    stroke="url(#goldBranchGrad)"
                                                    strokeWidth={strokeW}
                                                    strokeLinecap="round"
                                                />

                                                {/* 3-Leaf Foliage Flourish attached right above node boundary (matching reference image!) */}
                                                <use
                                                    href="#golden3LeafFlourish"
                                                    x={cTargetX}
                                                    y={cTargetY - 12}
                                                    transform={`rotate(90, ${cTargetX}, ${cTargetY - 12})`}
                                                />

                                                {/* Terminal Golden Circle Dot Cap at Child Node Boundary */}
                                                <use href="#goldenDotCap" x={cTargetX} y={cTargetY} />
                                            </g>
                                        );
                                    })}
                                </g>
                            );
                        })}

                        {/* 3. Ancestor Organic Curved Edges (Grandparent -> Parent) */}
                        {edges.ancestor.map(edge => {
                            const originX = edge.originX + offsetX;
                            const originY = edge.originY + offsetY;
                            const targetX = edge.targetX + offsetX;
                            const targetY = edge.targetY + offsetY;
                            const isActive = activeConnectionKeys.has(edge.id);
                            const strokeW = isActive ? '2.2' : '1.4';

                            const ancDy = targetY - originY;
                            const ancPathData = `M ${originX} ${originY} C ${originX + 10} ${originY + ancDy * 0.4}, ${targetX - 10} ${targetY - ancDy * 0.4}, ${targetX} ${targetY}`;

                            return (
                                <g key={edge.id} opacity={hoveredNodeId && !isActive ? 0.35 : 1}>
                                    {/* Origin Terminal Dot Cap */}
                                    <use href="#goldenDotCap" x={originX} y={originY} />

                                    {/* Organic Curved Vine Branch Path */}
                                    <path
                                        d={ancPathData}
                                        fill="none"
                                        stroke="url(#goldBranchGrad)"
                                        strokeWidth={strokeW}
                                        strokeLinecap="round"
                                    />

                                    {/* 3-Leaf Foliage Flourish attached near target end (matching reference image!) */}
                                    <use
                                        href="#golden3LeafFlourish"
                                        x={targetX}
                                        y={targetY - 14}
                                        transform={`rotate(90, ${targetX}, ${targetY - 14})`}
                                    />

                                    {/* Target Terminal Golden Circle Dot Cap */}
                                    <use href="#goldenDotCap" x={targetX} y={targetY} />
                                </g>
                            );
                        })}
                    </svg>

                    {/* Render Generation Section Label Banners */}
                    {generationBanners.map(banner => (
                        <div
                            key={`gen_banner_${banner.level}`}
                            style={{
                                position: 'absolute',
                                top: `${banner.y + offsetY}px`,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                backgroundColor: '#F5EFE6',
                                border: '1.2px solid #D8CBB7',
                                color: '#6E5C53',
                                padding: '0.35rem 1.5rem',
                                borderRadius: '50px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase',
                                boxShadow: '0 2px 10px rgba(184, 134, 11, 0.06)'
                            }}
                        >
                            <span style={{ color: '#7A9A60' }}>🌿</span>
                            <span>{banner.label}</span>
                            <span style={{ color: '#7A9A60' }}>🌿</span>
                        </div>
                    ))}

                    {/* Render Member Nodes */}
                    {nodes.map(member => {
                        const isMain = member.isMainPerson;
                        const isHighlighted = highlightedNodeIds.has(member.id);
                        const isHovered = hoveredNodeId === member.id;
                        const isDimmed = (searchTerm.trim().length > 0 && !isHighlighted) || (hoveredNodeId && hoveredNodeId !== member.id && !activeConnectionKeys.has(member.id));
                        const firstChar = member.name ? member.name.trim().charAt(0).toUpperCase() : '?';

                        const posX = member.x + offsetX;
                        const posY = member.y + offsetY;

                        return (
                            <div
                                key={member.id}
                                id={`tree-node-${member.id}`}
                                onClick={(e) => {
                                    if (hasDragged) {
                                        e.stopPropagation();
                                        return;
                                    }
                                    setSelectedMember(member);
                                }}
                                onMouseEnter={() => setHoveredNodeId(member.id)}
                                onMouseLeave={() => setHoveredNodeId(null)}
                                style={{
                                    position: 'absolute',
                                    top: `${posY}px`,
                                    left: `${posX}px`,
                                    zIndex: isMain ? 10 : 5,
                                    opacity: isDimmed ? 0.35 : 1,
                                    cursor: 'pointer',
                                    transition: isDragging ? 'none' : 'opacity 0.22s ease-out'
                                }}
                            >
                                {/* 1. Circular Avatar Node (Centered precisely at node coordinates posX, posY) */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '124px',
                                    height: '124px',
                                    borderRadius: '50%',
                                    backgroundColor: '#FAF6F0',
                                    padding: '5px',
                                    border: isMain 
                                        ? '3px solid #C48F95' 
                                        : isHighlighted 
                                            ? '3px solid #9D4EDD' 
                                            : '2px solid #D4AF37',
                                    outline: isMain 
                                        ? '2px solid rgba(196, 143, 149, 0.4)' 
                                        : '1.5px solid #F3E8D3',
                                    outlineOffset: '2px',
                                    boxShadow: isMain
                                        ? '0 0 35px rgba(196, 143, 149, 0.45), 0 0 70px rgba(196, 143, 149, 0.2), 0 8px 20px rgba(0,0,0,0.1)'
                                        : isHighlighted
                                            ? '0 0 25px rgba(157, 78, 221, 0.35)'
                                            : '0 8px 24px rgba(110, 92, 83, 0.1), inset 0 2px 6px rgba(255, 255, 255, 0.8)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transform: isHovered ? 'translate(-50%, -50%) scale(1.08)' : 'translate(-50%, -50%)',
                                    transition: 'transform 0.22s ease-out'
                                }}>
                                    <BotanicalLeaves isMemorialSubject={isMain} position="right" />

                                    {isMain && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '-12px',
                                            left: '-22px',
                                            backgroundColor: '#C48F95',
                                            color: '#FFFFFF',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '50px',
                                            fontSize: '0.68rem',
                                            fontWeight: '700',
                                            letterSpacing: '0.3px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.3rem',
                                            boxShadow: '0 3px 10px rgba(196, 143, 149, 0.4)',
                                            zIndex: 12,
                                            transform: 'rotate(-8deg)',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            <FaCrown style={{ fontSize: '0.65rem' }} /> Memorial Subject
                                        </div>
                                    )}

                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        backgroundColor: '#FFFDF9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid #E8DFD1'
                                    }}>
                                        {member.avatarUrl ? (
                                            <img 
                                                src={member.avatarUrl} 
                                                alt={member.name} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <span style={{ 
                                                fontSize: '3rem', 
                                                color: isMain ? '#C48F95' : '#5C4A42', 
                                                fontFamily: "'Playball', 'Alex Brush', 'Great Vibes', cursive", 
                                                fontWeight: '400',
                                                lineHeight: 1
                                            }}>
                                                {firstChar}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* 2. Text Details Block (Positioned cleanly below the avatar circle) */}
                                <div style={{
                                    position: 'absolute',
                                    top: '68px',
                                    left: '0',
                                    transform: 'translateX(-50%)',
                                    width: '210px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    pointerEvents: 'none'
                                }}>
                                    {/* Member Name */}
                                    <h3 style={{
                                        margin: '0 0 0.2rem 0',
                                        fontSize: '1.05rem',
                                        color: '#2C221E',
                                        fontFamily: "'Playfair Display', serif",
                                        fontWeight: '700',
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '200px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        lineHeight: '1.25',
                                        textShadow: '0 1px 3px rgba(255, 255, 255, 0.9)'
                                    }}>
                                        {member.name}
                                    </h3>

                                    {/* Relationship Badge */}
                                    {member.relationship && !isMain && (
                                        <span style={{
                                            display: 'inline-block',
                                            backgroundColor: 'rgba(243, 237, 230, 0.95)',
                                            color: '#6E5C53',
                                            fontSize: '0.78rem',
                                            padding: '0.18rem 0.75rem',
                                            borderRadius: '50px',
                                            fontWeight: '500',
                                            marginBottom: '0.2rem',
                                            border: '1px solid #E8DFD1',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                                        }}>
                                            {member.relationship}
                                        </span>
                                    )}

                                    {/* Dates */}
                                    {member.dates && (
                                        <p style={{ 
                                            margin: 0, 
                                            fontSize: '0.78rem', 
                                            color: '#8C7B70', 
                                            fontWeight: '500',
                                            textShadow: '0 1px 2px rgba(255, 255, 255, 0.9)'
                                        }}>
                                            {member.dates}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Unconnected Members Notice Banner */}
            {disconnectedNodes.length > 0 && (
                <div style={{
                    marginTop: '1.25rem',
                    backgroundColor: '#FFFBEB',
                    border: '1px solid #FCD34D',
                    borderRadius: '14px',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    color: '#92400E',
                    fontSize: '0.88rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FaExclamationTriangle style={{ fontSize: '1.1rem', color: '#D97706' }} />
                        <span>
                            <strong>Unconnected Family Members ({disconnectedNodes.length}):</strong> {disconnectedNodes.map(n => n.name || 'Unnamed').join(', ')}. Select relationships in admin settings to integrate them into the tree.
                        </span>
                    </div>
                </div>
            )}

            {/* Detail Popup Modal */}
            {selectedMember && (
                <div 
                    onClick={() => setSelectedMember(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(44, 34, 30, 0.45)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        padding: '1rem',
                        backdropFilter: 'blur(5px)',
                        animation: 'fadeIn 0.2s ease-out'
                    }}
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: '#FAF6F0',
                            borderRadius: '24px',
                            padding: '2rem',
                            maxWidth: '440px',
                            width: '100%',
                            position: 'relative',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
                            border: '1.5px solid #E8DFD1'
                        }}
                    >
                        <button
                            onClick={() => setSelectedMember(null)}
                            title="Close"
                            style={{
                                position: 'absolute',
                                top: '1.25rem',
                                right: '1.25rem',
                                background: '#EFE8E1',
                                border: 'none',
                                borderRadius: '50%',
                                width: '34px',
                                height: '34px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: '#6E5C53'
                            }}
                        >
                            <FaTimes />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                margin: '0 auto 1rem auto',
                                overflow: 'hidden',
                                backgroundColor: '#FFFDF9',
                                border: `3px solid ${selectedMember.isMainPerson ? '#C48F95' : '#D4AF37'}`,
                                outline: '2px solid #F3E8D3',
                                outlineOffset: '2px',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
                            }}>
                                {selectedMember.avatarUrl ? (
                                    <img src={selectedMember.avatarUrl} alt={selectedMember.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.6rem', color: '#5C4A42', fontFamily: "'Alex Brush', cursive" }}>
                                        {selectedMember.name ? selectedMember.name.trim().charAt(0).toUpperCase() : '?'}
                                    </div>
                                )}
                            </div>

                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#2C221E', margin: '0 0 0.4rem 0', fontWeight: '700' }}>
                                {selectedMember.name}
                            </h3>

                            {selectedMember.relationship && (
                                <span style={{ backgroundColor: '#C48F95', color: '#FFFFFF', padding: '0.25rem 0.95rem', borderRadius: '50px', fontSize: '0.82rem', fontWeight: '500', display: 'inline-block' }}>
                                    {selectedMember.relationship}
                                </span>
                            )}

                            {selectedMember.dates && (
                                <p style={{ margin: '0.5rem 0 0 0', color: '#8C7B70', fontSize: '0.92rem', fontWeight: '500' }}>
                                    {selectedMember.dates}
                                </p>
                            )}
                        </div>

                        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', marginBottom: '1.25rem', border: '1px solid #E8DFD1' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: '#5C4A42', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <FaBookOpen style={{ color: '#C48F95' }} /> Biography & Notes
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.88rem', color: '#6E5C53', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                {selectedMember.bio || 'No additional biographical notes provided.'}
                            </p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button
                                onClick={() => setSelectedMember(null)}
                                style={{
                                    padding: '0.6rem 1.4rem',
                                    borderRadius: '50px',
                                    border: '1px solid #D8CBB7',
                                    backgroundColor: '#FFFFFF',
                                    color: '#5C4A42',
                                    fontWeight: '500',
                                    fontSize: '0.88rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default memo(FamilyTree);

