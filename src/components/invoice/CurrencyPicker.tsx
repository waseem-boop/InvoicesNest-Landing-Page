"use client";
import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ALL_CURRENCIES, Currency } from '@/lib/currencies';
export default function CurrencyPicker({value,onChange}:{value:string;onChange:(currency:Currency)=>void}) {
    const [open,setOpen]=useState(false), [query,setQuery]=useState(''), [active,setActive]=useState(0);
    const root=useRef<HTMLDivElement>(null), input=useRef<HTMLInputElement>(null), id=useId();
    const selected=ALL_CURRENCIES.find(item=>item.code===value)||ALL_CURRENCIES.find(item=>item.code==='USD')!;
    const search=query.trim().toLowerCase();
    const filtered=ALL_CURRENCIES.filter(item=>!search||item.code.toLowerCase().includes(search)||item.name.toLowerCase().includes(search));
    const choose=(currency:Currency)=>{onChange(currency);setOpen(false);setQuery('');};
    useEffect(()=>{const close=(event:MouseEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false);};document.addEventListener('mousedown',close);return()=>document.removeEventListener('mousedown',close);},[]);
    useEffect(()=>{if(open)input.current?.focus();},[open]);
    return <div ref={root} className="relative nest-currency-picker" onKeyDown={event=>{
        if(event.key==='Escape'){setOpen(false);event.stopPropagation();}
        if(open&&(event.key==='ArrowDown'||event.key==='ArrowUp')){event.preventDefault();setActive(index=>(index+(event.key==='ArrowDown'?1:-1)+filtered.length)%Math.max(1,filtered.length));}
        if(open&&event.key==='Enter'&&filtered[active]){event.preventDefault();choose(filtered[active]);}
    }}>
      <button type="button" aria-label="Select currency" aria-expanded={open} aria-haspopup="listbox" onClick={()=>{setOpen(!open);setActive(0);}} className="w-full flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm"><ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0"/><span>{selected.flag} {selected.code} ({selected.symbol}) — {selected.name}</span></button>
      {open&&<div className="absolute bottom-full left-0 mb-2 w-full min-w-64 z-50 rounded-xl border bg-white p-2 shadow-lg">
        <input ref={input} aria-label="Search currency name or code" role="combobox" aria-expanded={open} aria-controls={id} aria-autocomplete="list" aria-activedescendant={filtered[active]?id+'-'+active:undefined} placeholder="Search currency name or code…" value={query} onChange={event=>{setQuery(event.target.value);setActive(0);}} className="w-full border-0 border-b border-slate-100 rounded-none p-3 text-sm outline-none focus:ring-0 focus:outline-none"/>
        <div id={id} role="listbox" aria-label="Currencies" className="max-h-64 overflow-auto mt-2">{filtered.map((currency,index)=><button id={id+'-'+index} type="button" role="option" aria-selected={value===currency.code} key={currency.code} onClick={()=>choose(currency)} className={'block w-full px-3 py-2 text-left text-sm rounded-lg '+(index===active?'bg-indigo-50':'hover:bg-slate-50')}>{currency.flag} {currency.code} — {currency.name} ({currency.symbol})</button>)}</div>
        {!filtered.length&&<p className="p-3 text-sm">No matching currencies.</p>}
      </div>}
    </div>;
}
