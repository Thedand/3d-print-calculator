"use client";

import { useMemo, useState } from "react";

const money = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

function Icon({ children }: { children: React.ReactNode }) {
  return <span className="section-icon" aria-hidden="true">{children}</span>;
}

function Field({ label, value, onChange, unit, min = 0, step = 1 }: { label: string; value: number; onChange: (n: number) => void; unit: string; min?: number; step?: number }) {
  return (
    <label className="field">
      <span>{label}</span>
      <span className="input-shell">
        <input
  type="number"
  min={min}
  step={step}
  value={value === 0 ? "" : value}
  onChange={(e) =>
    onChange(Math.max(min, Number(e.target.value) || 0))
  }/>
        <b>{unit}</b>
      </span>
    </label>
  );
}

export default function Home() {
  const [weight, setWeight] = useState(128);
  const [hours, setHours] = useState(6);
  const [minutes, setMinutes] = useState(40);
  const [quantity, setQuantity] = useState(1);
  const [material, setMaterial] = useState("PLA");
  const [spoolPrice, setSpoolPrice] = useState(1450);
  const [spoolWeight, setSpoolWeight] = useState(1000);
  const [power, setPower] = useState(350);
  const [tariff, setTariff] = useState(6.2);
  const [depreciation, setDepreciation] = useState(24);
  const [prep, setPrep] = useState(180);
  const [post, setPost] = useState(250);
  const [failure, setFailure] = useState(5);
  const [markup, setMarkup] = useState(30);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const time = hours + minutes / 60;
    const materialCost = weight * (spoolPrice / Math.max(spoolWeight, 1)) * quantity;
    const energy = time * (power / 1000) * tariff * quantity;
    const wear = time * depreciation * quantity;
    const labor = (prep + post) * quantity;
    const direct = materialCost + energy + wear + labor;
    const reserve = direct * (failure / 100);
    const cost = direct + reserve;
    const sale = cost * (1 + markup / 100);
    return { materialCost, energy, wear, labor, reserve, cost, sale, each: cost / Math.max(quantity, 1), gram: spoolPrice / Math.max(spoolWeight, 1) };
  }, [weight, hours, minutes, quantity, spoolPrice, spoolWeight, power, tariff, depreciation, prep, post, failure, markup]);

  const copyResult = async () => {
    const text = `Расчёт 3D-печати (${material}): себестоимость партии — ${money.format(result.cost)} ₽, за модель — ${money.format(result.each)} ₽, рекомендуемая цена — ${money.format(result.sale)} ₽.`;
    await navigator.clipboard?.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Formula 3D — на главную"><span className="brand-cube"><i /></span><strong>FORMULA 3D</strong></a>
        <nav aria-label="Основная навигация"><a className="active" href="#calculator">Калькулятор</a><a href="#material">Материалы</a><a href="#result">Итог</a></nav>
        <span className="status"><i /> Расчёт онлайн</span>
      </header>

      <div className="page" id="top">
        <section className="intro">
          <p>ПРОИЗВОДСТВЕННЫЙ РАСЧЁТ</p>
          <h1>Расчёт себестоимости</h1>
          <span>Все затраты на печать одной модели — прозрачно и без таблиц.</span>
        </section>

        <div className="calculator" id="calculator">
          <section className="form-card" aria-label="Параметры расчёта">
            <div className="form-section">
              <div className="section-title"><Icon>◇</Icon><div><h2>Модель</h2><p>Параметры задания из слайсера</p></div></div>
              <div className="fields three">
                <Field label="Вес модели" value={weight} onChange={setWeight} unit="г" />
                <label className="field"><span>Время печати</span><span className="time-fields"><span className="input-shell"><input type="number" min="0" value={hours === 0 ? "" : hours} onChange={(e) => setHours(Math.max(0, +e.target.value || 0))}/><b>ч</b></span><span className="input-shell"><input type="number" min="0" max="59" value={minutes === 0 ? "" : minutes} onChange={(e) => setMinutes(Math.min(59, Math.max(0, +e.target.value || 0)))}/><b>мин</b></span></span></label>
                <Field label="Количество" value={quantity} onChange={setQuantity} unit="шт." min={1} />
              </div>
            </div>

            <div className="form-section" id="material">
              <div className="section-title"><Icon>◎</Icon><div><h2>Материал</h2><p>Стоимость пластика или смолы</p></div></div>
              <div className="fields material-grid">
                <label className="field"><span>Материал</span><span className="select-shell"><select value={material} onChange={(e) => setMaterial(e.target.value)}><option>PLA</option><option>PETG</option><option>ABS</option><option>TPU</option><option>ASA</option><option>Resin</option></select></span></label>
                <Field label="Цена катушки" value={spoolPrice} onChange={setSpoolPrice} unit="₽" />
                <Field label="Вес катушки" value={spoolWeight} onChange={setSpoolWeight} unit="г" />
                <div className="price-per"><span>Цена за грамм</span><strong>{result.gram.toFixed(2).replace(".", ",")} ₽ / г</strong></div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title"><Icon>⌁</Icon><div><h2>Оборудование и энергия</h2><p>Расходы за время работы принтера</p></div></div>
              <div className="fields three">
                <Field label="Мощность принтера" value={power} onChange={setPower} unit="Вт" />
                <Field label="Тариф" value={tariff} onChange={setTariff} unit="₽/кВт·ч" step={0.1} />
                <Field label="Амортизация" value={depreciation} onChange={setDepreciation} unit="₽/ч" />
              </div>
            </div>

            <div className="form-section last">
              <div className="section-title"><Icon>⌕</Icon><div><h2>Дополнительно</h2><p>Работа, риск брака и прибыль</p></div></div>
              <div className="fields extras">
                <Field label="Подготовка" value={prep} onChange={setPrep} unit="₽" />
                <Field label="Постобработка" value={post} onChange={setPost} unit="₽" />
                <label className="field range-field"><span>Резерв на брак <b>{failure}%</b></span><input aria-label="Резерв на брак" type="range" min="0" max="40" value={failure} onChange={(e) => setFailure(+e.target.value)} /></label>
                <label className="field range-field"><span>Наценка <b>{markup}%</b></span><input aria-label="Наценка" type="range" min="0" max="200" value={markup} onChange={(e) => setMarkup(+e.target.value)} /></label>
              </div>
            </div>
          </section>

          <aside className="result-card" id="result" aria-live="polite">
            <p className="result-label">Итоговая себестоимость</p>
            <div className="total"><strong>{money.format(result.cost)} ₽</strong><span>за {quantity} {quantity === 1 ? "модель" : "шт."}</span></div>
            <div className="breakdown">
              <div><span>Материал</span><b>{money.format(result.materialCost)} ₽</b></div>
              <div><span>Электроэнергия</span><b>{money.format(result.energy)} ₽</b></div>
              <div><span>Амортизация</span><b>{money.format(result.wear)} ₽</b></div>
              <div><span>Работа</span><b>{money.format(result.labor)} ₽</b></div>
              <div><span>Резерв на брак</span><b>{money.format(result.reserve)} ₽</b></div>
            </div>
            <div className="batch"><span>За одну модель</span><strong>{money.format(result.each)} ₽</strong></div>
            <div className="sale"><span>Цена с наценкой {markup}%</span><strong>{money.format(result.sale)} ₽</strong></div>
            <button className="copy" onClick={copyResult}>{copied ? "✓ Расчёт скопирован" : "Скопировать расчёт"}</button>
            <p className="hint">Суммы обновляются автоматически</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
