/* Tweaks panel — gauze / blood intensity */
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "wrap": 0.7
}/*EDITMODE-END*/;

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.style.setProperty('--wrap', String(t.wrap));
  }, [t.wrap]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Wound intensity">
        <TweakSlider
          label="Gauze + blood"
          value={t.wrap}
          min={0} max={1} step={0.05}
          onChange={(v) => setTweak('wrap', v)}
          format={(v) => {
            if (v < 0.15) return 'Clean';
            if (v < 0.4) return 'Faint stain';
            if (v < 0.7) return 'Wrapped';
            if (v < 0.9) return 'Bleeding';
            return 'Wounded';
          }}
        />
        <div style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: 10,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#888',
          marginTop: 8,
          lineHeight: 1.5
        }}>
          Controls the gauze weave, blood stains, and drip effects across the site.
        </div>
      </TweakSection>
      <TweakSuggestionBar suggestions={[
        "Add real product photography",
        "Make the shop hero even more intense",
        "Show what an individual product page would look like",
        "Add a single-artist case study page",
      ]} />
    </TweaksPanel>
  );
}

const _root = document.createElement('div');
document.body.appendChild(_root);
ReactDOM.createRoot(_root).render(<TweaksApp />);
