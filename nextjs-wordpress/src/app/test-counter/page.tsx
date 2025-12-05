import CounterBlock from '@/components/blocks/counter-block/CounterBlock';

export default function TestCounterPage() {
  const counterData = {
    heading: "About us",
    sub_heading: "A global leader in next-generation digital services and consulting",
    counters: [
      {
        number: "59",
        prefix: "",
        suffix: "",
        label: "countries where we have trusting clients"
      },
      {
        number: "19.7",
        prefix: "US$",
        suffix: "",
        label: "billion total revenue (LTM)"
      },
      {
        number: "24",
        prefix: "",
        suffix: "+",
        label: "million training (hours) conducted for employees, globally"
      }
    ]
  };

  return (
    <main>
      <CounterBlock data={counterData} />
    </main>
  );
}
