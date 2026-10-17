export default function SectionEyebrow({children}:{children:React.ReactNode}) {
 return <div className="w-layout-hflex rt-sub-text-main nest-section-eyebrow"><div className="w-layout-hflex rt-sub-text-wrapper"><div className="rt-sub-text-dot"/><div className="rt-sub-text">{children}</div></div><div className="w-layout-vflex rt-gradient-box" aria-hidden="true"><div className="rt-button-linear rt-color-change"/><div className="rt-button-linear rt-color-change rt-2"/></div></div>;
}
