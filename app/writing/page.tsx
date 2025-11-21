'use client';

import {
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import HanziWriter, { type CharacterJson } from 'hanzi-writer';
import { pinyin } from 'pinyin-pro';
import {
  Eraser,
  Pencil,
  RefreshCcw,
  Sparkles,
  Volume2,
//   Wand2,
} from 'lucide-react';
import charactersData from '../../data/chinese-character.json';

type Point = { x: number; y: number };
type StrokePath = Point[];

const DEFAULT_CHAR = '你';
const characterMap = charactersData as Record<string, string[]>;
const gradeKeys = Object.keys(characterMap).sort();
type GradeKey = (typeof gradeKeys)[number] | string;

const formatGradeLabel = (key: GradeKey) => {
  const num = Number(key.replace('grade', ''));
  if (Number.isNaN(num)) return key;
  const chineseNumerals = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  return `小学${chineseNumerals[num - 1] ?? num}年级`;
};

const getPinyin = (value: string) => {
  if (!value) return '';
  try {
    return pinyin(value, { toneType: 'symbol', type: 'string', pattern: 'pinyin' });
  } catch {
    return value;
  }
};

const gridColor = '#dbeafe';
const strokeColor = '#2563eb';

export default function WritingPage() {
  const fallbackGrade: GradeKey = gradeKeys[0] ?? 'grade01';
  const [selectedGrade, setSelectedGrade] = useState<GradeKey>(fallbackGrade);
  const [charIndex, setCharIndex] = useState(0);
  const [activeChar, setActiveChar] = useState(DEFAULT_CHAR);
  const [strokeCount, setStrokeCount] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hint, setHint] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const animationRef = useRef<HTMLDivElement>(null);
  const practiceCardRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const strokePathsRef = useRef<StrokePath[]>([]);
  const guidePathsRef = useRef<Path2D[]>([]);
  const guideTransformRef = useRef({ x: 0, y: 0, scale: 1 });
  const strokeCountRef = useRef(0);

  const activePinyin = useMemo(() => getPinyin(activeChar), [activeChar]);
  const gradeCharacters = useMemo(() => characterMap[selectedGrade] ?? [], [selectedGrade]);
  const hasPrevChar = charIndex > 0;
  const hasNextChar = charIndex < gradeCharacters.length - 1;

  const persistProgress = useCallback((grade: GradeKey, index: number) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(
      'hanziWritingProgress',
      JSON.stringify({ grade, index }),
    );
  }, []);

  const goToCharacter = useCallback(
    (targetIndex: number) => {
      const list = gradeCharacters;
      if (!list.length) return;
      const clamped = Math.max(0, Math.min(targetIndex, list.length - 1));
      setCharIndex(clamped);
    },
    [gradeCharacters],
  );

  const handleGradeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (!characterMap[value]) return;
    setSelectedGrade(value);
    setCharIndex(0);
  };

  /** -------- Hanzi Writer ---------- */
  useEffect(() => {
    if (!animationRef.current) return;

    animationRef.current.innerHTML = '';
    const writer = HanziWriter.create(animationRef.current, activeChar, {
      width: 260,
      height: 260,
      padding: 20,
      showOutline: true,
      strokeColor: '#0f172a',
      radicalColor: '#0ea5e9',
      strokeAnimationSpeed: 1.1,
      delayBetweenLoops: 800,
      showCharacter: true,
    });

    writerRef.current = writer;
    writer.animateCharacter();

    return () => {
      writerRef.current?.pauseAnimation();
    };
  }, [activeChar]);

  const playAnimation = () => {
    writerRef.current?.animateCharacter();
  };

  /** --------- Speech synthesis ---------- */
  const speak = () => {
    if (typeof window === 'undefined' || !activeChar) return;
    const synth = window.speechSynthesis;
    if (!synth) {
      setHint('当前浏览器不支持语音播报');
      return;
    }

    setIsSpeaking(true);
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(activeChar);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synth.speak(utterance);
  };

  /** --------- Canvas helpers ----------- */
  const drawGrid = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();
    ctx.restore();
  }, []);

  const drawGuide = useCallback((completedCount: number) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    const guidePaths = guidePathsRef.current;
    if (!guidePaths.length) return;

    ctx.save();
    const { x, y, scale } = guideTransformRef.current;
    ctx.translate(x, canvas.height - y);
    ctx.scale(scale, -scale);
    guidePaths.forEach((path, index) => {
      const isCompleted = index < completedCount;
      ctx.fillStyle = isCompleted ? strokeColor : '#d4d4d8';
      ctx.fill(path);
    });
    ctx.restore();
  }, []);

  const redraw = useCallback(
    (countOverride?: number) => {
      drawGrid();
      const completedStrokes = Math.min(
        countOverride ?? strokeCountRef.current,
        guidePathsRef.current.length,
      );
      drawGuide(completedStrokes);
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;

      ctx.save();
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = strokeColor;

      strokePathsRef.current.forEach((path) => {
        if (!path.length) return;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i += 1) {
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
      });
      ctx.restore();
    },
    [drawGrid, drawGuide],
  );

  useEffect(() => {
    strokeCountRef.current = strokeCount;
  }, [strokeCount]);

  const updateGuideTransform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !guidePathsRef.current.length) return;
    const transform = HanziWriter.getScalingTransform(canvas.width, canvas.height, 30);
    guideTransformRef.current = {
      x: transform.x,
      y: transform.y,
      scale: transform.scale,
    };
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const size = Math.min(parent.clientWidth, 420);
    canvas.width = size;
    canvas.height = size;
    updateGuideTransform();
    redraw();
  }, [redraw, updateGuideTransform]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;
    resizeCanvas();
    setIsCanvasReady(true);

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    if (!isCanvasReady) return;
    let cancelled = false;

    const loadChar = async () => {
      try {
        const data = (await HanziWriter.loadCharacterData(activeChar)) as CharacterJson | undefined;
        if (!data || cancelled) return;
        guidePathsRef.current = data.strokes.map((strokePath) => new Path2D(strokePath));
        updateGuideTransform();
        redraw();
      } catch {
        if (!cancelled) {
          setHint('暂时无法加载汉字数据，请稍后重试');
        }
      }
    };

    loadChar();

    return () => {
      cancelled = true;
    };
  }, [activeChar, isCanvasReady, redraw, updateGuideTransform]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cache = window.localStorage.getItem('hanziWritingProgress');
    if (!cache) return;
    try {
      const parsed = JSON.parse(cache) as { grade?: GradeKey; index?: number };
      if (parsed.grade && characterMap[parsed.grade]) {
        setSelectedGrade(parsed.grade);
        const limit = characterMap[parsed.grade].length - 1;
        const idx = Math.max(0, Math.min(parsed.index ?? 0, limit));
        setCharIndex(idx);
      }
    } catch {
      // ignore corrupted cache
    }
  }, []);

  useEffect(() => {
    const list = characterMap[selectedGrade] ?? [];
    if (!list.length) {
      setActiveChar(DEFAULT_CHAR);
      return;
    }
    const normalizedIndex = Math.max(0, Math.min(charIndex, list.length - 1));
    if (normalizedIndex !== charIndex) {
      setCharIndex(normalizedIndex);
      return;
    }
    const nextChar = list[normalizedIndex] ?? DEFAULT_CHAR;
    setActiveChar(nextChar);
    strokePathsRef.current = [];
    setStrokeCount(0);
    setIsDrawing(false);
    redraw(0);
    persistProgress(selectedGrade, normalizedIndex);
  }, [selectedGrade, charIndex, persistProgress, redraw]);

  const getPoint = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x, y };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((x - rect.left) * canvas.width) / rect.width,
      y: ((y - rect.top) * canvas.height) / rect.height,
    };
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    const point = getPoint(clientX, clientY);
    strokePathsRef.current = [[point]];
    setIsDrawing(true);
    canvasRef.current?.setPointerCapture(event.pointerId);
    redraw();
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    event.preventDefault();
    const { clientX, clientY } = event;
    const point = getPoint(clientX, clientY);
    const paths = strokePathsRef.current;
    if (!paths.length) return;
    paths[paths.length - 1] = [...paths[paths.length - 1], point];
    strokePathsRef.current = [...paths];
    redraw();
  };

  const endDrawing = (event?: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const hasStroke =
      strokePathsRef.current.length > 0 && strokePathsRef.current[0].length > 1;
    setIsDrawing(false);
    if (event) {
      try {
        canvasRef.current?.releasePointerCapture(event.pointerId);
      } catch {
        // ignore if pointer already released
      }
    }
    strokePathsRef.current = [];
    if (hasStroke) {
      setStrokeCount((prev) => {
        const next = Math.min(prev + 1, guidePathsRef.current.length);
        redraw(next);
        return next;
      });
    } else {
      redraw();
    }
  };

  const clearCanvas = () => {
    strokePathsRef.current = [];
    setStrokeCount(0);
    setIsDrawing(false);
    redraw(0);
  };

  const undoStroke = () => {
    if (!strokeCount) return;
    const next = Math.max(0, strokeCount - 1);
    setStrokeCount(next);
    redraw(next);
  };

  /** -------- UI handlers ---------- */

    // const scrollToPractice = () => {
    //     practiceCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-white to-[#f0f9ff] pb-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pt-12 lg:flex-row lg:px-8">
        <section className="w-full flex-1 space-y-6">
          <div className="rounded-3xl bg-white/80 p-8 shadow-xl shadow-primary/5 backdrop-blur">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-primary-600">AI 汉字笔画学习</p>
              <h1 className="text-3xl font-semibold leading-tight text-slate-900">
                输入一个汉字，查看笔顺并练习书写
              </h1>
              <p className="text-sm text-slate-500">
                电脑可使用鼠标书写，平板与手机支持触摸笔与手指。
              </p>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">选择年级</label>
                <select
                  value={selectedGrade}
                  onChange={handleGradeChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                >
                  {gradeKeys.map((key) => (
                    <option value={key} key={key}>
                      {formatGradeLabel(key)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">按顺序练习</label>
                <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <button
                    type="button"
                    onClick={() => goToCharacter(charIndex - 1)}
                    disabled={!hasPrevChar}
                    className="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 transition disabled:opacity-40"
                  >
                    上一个
                  </button>
                  <span className="text-sm font-medium text-slate-500">
                    进度 {gradeCharacters.length ? charIndex + 1 : 0}/{gradeCharacters.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => goToCharacter(charIndex + 1)}
                    disabled={!hasNextChar}
                    className="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 transition disabled:opacity-40"
                  >
                    写下一个
                  </button>
                </div>
              </div>
            </div>
            {hint && <p className="mt-2 text-sm text-rose-500">{hint}</p>}

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-6 shadow-inner">
                <p className="text-sm font-medium text-slate-500">当前汉字</p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-5xl font-semibold text-slate-900">{activeChar}</span>
                  <span className="text-lg font-medium text-primary-600">{activePinyin}</span>
                </div>
                <div
                  ref={animationRef}
                  className="mt-6 flex h-[280px] items-center justify-center rounded-2xl bg-white shadow"
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={playAnimation}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary-200 hover:text-primary-600"
                  >
                    <Sparkles className="h-4 w-4" />
                    笔画演示
                  </button>
                  <button
                    type="button"
                    onClick={speak}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary-200 hover:text-primary-600"
                  >
                    <Volume2 className="h-4 w-4" />
                    {isSpeaking ? '播放中…' : '朗读发音'}
                  </button>
                  {/* 
                  <button
                    type="button"
                    onClick={scrollToPractice}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary-200 hover:text-primary-600"
                  >
                    <Wand2 className="h-4 w-4" />
                    我来写写看
                  </button>
                  */}
                  
                </div>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl" ref={practiceCardRef}>
                <div className="flex flex-col gap-2">
                  {/* <p className="text-sm font-medium text-primary-600">临摹指南</p> */}
                  <h2 className="text-xl font-semibold text-slate-900">手写练习区</h2>
                  <p className="text-sm text-slate-500">
                    按住鼠标或手指即可开始书写，触控设备支持多指缩放页面但建议写字时单指操作。
                  </p>
                </div>

                <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <canvas
                    ref={canvasRef}
                    className="mx-auto aspect-square w-full max-w-sm touch-none rounded-2xl bg-white shadow-inner"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={endDrawing}
                    onPointerLeave={endDrawing}
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={undoStroke}
                      disabled={!strokeCount}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition disabled:opacity-40"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      撤销上一步
                    </button>
                    <button
                      type="button"
                      onClick={clearCanvas}
                      disabled={!strokeCount}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition disabled:opacity-40"
                    >
                      <Eraser className="h-4 w-4" />
                      清空画布
                    </button>
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
                      <Pencil className="h-4 w-4 text-primary-500" />
                      已写 {strokeCount} 笔
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


