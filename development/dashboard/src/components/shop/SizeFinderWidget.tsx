import React, { useState } from 'react';
import { SizeCode } from '../../types';
import { Icon } from '../ui/Icon';

interface SizeFinderWidgetProps {
  onSelectSizeFilter?: (size: SizeCode | null) => void;
  activeFilterSize?: SizeCode | null;
}

export const SizeFinderWidget: React.FC<SizeFinderWidgetProps> = ({
  onSelectSizeFilter,
  activeFilterSize,
}) => {
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);

  // Exact chest formula from REQ-F-007: chest = 0.3*h + 0.55*w + 5
  const estimatedChest = Math.round(0.3 * height + 0.55 * weight + 5);
  const garmentChest = estimatedChest + 14; // +14 cm ease allowance

  let recommendedSize: SizeCode = 'M';
  if (estimatedChest < 88) recommendedSize = 'XS';
  else if (estimatedChest < 94) recommendedSize = 'S';
  else if (estimatedChest < 102) recommendedSize = 'M';
  else if (estimatedChest < 110) recommendedSize = 'L';
  else if (estimatedChest < 118) recommendedSize = 'XL';
  else recommendedSize = 'XXL';

  const sizeMetrics: Record<
    SizeCode,
    { chest: number; length: number; shoulder: number; note: string }
  > = {
    XS: { chest: 100, length: 70, shoulder: 44, note: 'Slim & clean drape' },
    S: { chest: 106, length: 72, shoulder: 46, note: 'Tailored casual fit' },
    M: { chest: 112, length: 74, shoulder: 48, note: 'Classic airy relaxed' },
    L: { chest: 118, length: 76, shoulder: 50, note: 'Generous easy drape' },
    XL: { chest: 126, length: 78, shoulder: 52, note: 'Broad comfortable cut' },
    XXL: { chest: 134, length: 80, shoulder: 54, note: 'Roomy breezy fit' },
  };

  const metric = sizeMetrics[recommendedSize];

  return (
    <section className="size-finder-section" id="size-finder">
      <div className="size-finder-card">
        <div className="size-finder-card__left">
          <div className="section-eyebrow">
            <Icon name="trend" size={16} />
            <span>Anthropometric Fit Engine</span>
          </div>

          <h2 className="section-title">
            Find your exact shirt size in <em>10 seconds.</em>
          </h2>

          <p className="section-desc">
            Move the sliders to match your height and weight. Our Dhaka atelier
            uses a verified chest ease formula ensuring your linen shirt falls
            naturally without bunching or pulling.
          </p>

          <div className="sliders-wrap">
            {/* Height Slider */}
            <div className="slider-group">
              <div className="slider-header">
                <label htmlFor="height-slider" className="slider-label">
                  Your Height
                </label>
                <span className="slider-value">
                  <strong>{height}</strong> cm / {Math.floor(height / 30.48)}&apos;
                  {Math.round((height % 30.48) / 2.54)}&quot;
                </span>
              </div>
              <input
                id="height-slider"
                type="range"
                min="148"
                max="198"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="range-input"
              />
              <div className="slider-scale">
                <span>148 cm</span>
                <span>175 cm</span>
                <span>198 cm</span>
              </div>
            </div>

            {/* Weight Slider */}
            <div className="slider-group">
              <div className="slider-header">
                <label htmlFor="weight-slider" className="slider-label">
                  Your Weight
                </label>
                <span className="slider-value">
                  <strong>{weight}</strong> kg / {Math.round(weight * 2.20462)} lbs
                </span>
              </div>
              <input
                id="weight-slider"
                type="range"
                min="40"
                max="110"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="range-input"
              />
              <div className="slider-scale">
                <span>40 kg</span>
                <span>75 kg</span>
                <span>110 kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Size Output Column */}
        <div className="size-finder-card__right">
          <div className="rec-badge-wrap">
            <span className="rec-eyebrow">Your Recommended Size</span>
            <div className="rec-size-pill">
              <span className="rec-size-letter">{recommendedSize}</span>
              <span className="rec-size-tag">{metric.note}</span>
            </div>
          </div>

          <div className="rec-specs-grid">
            <div className="spec-tile">
              <span className="spec-label">Body Chest</span>
              <strong className="spec-val">{estimatedChest} cm</strong>
            </div>
            <div className="spec-tile">
              <span className="spec-label">Garment Chest (+14cm)</span>
              <strong className="spec-val">{garmentChest} cm</strong>
            </div>
            <div className="spec-tile">
              <span className="spec-label">Garment Length</span>
              <strong className="spec-val">{metric.length} cm</strong>
            </div>
            <div className="spec-tile">
              <span className="spec-label">Shoulder</span>
              <strong className="spec-val">{metric.shoulder} cm</strong>
            </div>
          </div>

          <div className="rec-action-row">
            <button
              type="button"
              className={`btn btn--full ${
                activeFilterSize === recommendedSize
                  ? 'btn--primary'
                  : 'btn--secondary'
              }`}
              onClick={() => {
                if (onSelectSizeFilter) {
                  onSelectSizeFilter(
                    activeFilterSize === recommendedSize ? null : recommendedSize
                  );
                }
                const el = document.getElementById('collection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Icon name="check" size={16} />
              <span>
                {activeFilterSize === recommendedSize
                  ? `Filtering by Size ${recommendedSize} (Click to reset)`
                  : `Show Shirts in Size ${recommendedSize}`}
              </span>
            </button>
          </div>

          <div className="rec-guarantee">
            <Icon name="shield" size={16} />
            <span>
              <strong>Fit Guarantee:</strong> Shoppers using this finder achieve a{' '}
              <strong>4.7% return rate</strong> vs. 11.8% industry standard.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
