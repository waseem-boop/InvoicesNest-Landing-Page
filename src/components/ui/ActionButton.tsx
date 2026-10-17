import Image from "next/image";
import type {ReactNode} from "react";

type Props={href:string;children:ReactNode;className?:string;"data-motion"?:string};
/** Shared markup; callers retain the original classes and animation targets. */
export default function ActionButton({href,children,className="rt-button w-inline-block","data-motion":motion}:Props){
 return <a href={href} className={className} data-motion={motion}>
  <div className="w-layout-vflex rt-button-text-wrap rt-overflow-hidden"><div className="rt-button-font rt-one">{children}</div><div className="rt-button-font rt-two" aria-hidden="true">{children}</div></div>
  <div className="rt-button-icon-wrap"><Image src="/assets/fbc6e13d73-69845361d597aad556ac171d_optimatia-home-navbar-star.svg" alt="" className="rt-button-star-image" width={22} height={23} sizes="22px"/></div>
 </a>;
}
