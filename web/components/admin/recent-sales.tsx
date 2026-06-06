export function RecentSales() {
  const sales = [
    {
      name: "Ahmed Hassan",
      email: "ahmed.hassan@email.com",
      amount: "+$1,999.00",
      initials: "AH",
    },
    {
      name: "Fadumo Omar",
      email: "fadumo.omar@email.com",
      amount: "+$39.00",
      initials: "FO",
    },
    {
      name: "Khadar Ali",
      email: "khadar.ali@email.com",
      amount: "+$299.00",
      initials: "KA",
    },
    {
      name: "Yusuf Khalid",
      email: "yusuf.khalid@email.com",
      amount: "+$99.00",
      initials: "YK",
    },
    {
      name: "Sahra Mohamud",
      email: "sahra.mohamud@email.com",
      amount: "+$39.00",
      initials: "SM",
    },
  ];

  return (
    <div className="space-y-8">
      {sales.map((sale, i) => (
        <div key={i} className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              {sale.initials}
            </span>
          </div>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-100">
              {sale.name}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {sale.email}
            </p>
          </div>
          <div className="ml-auto font-medium text-zinc-900 dark:text-zinc-100">
            {sale.amount}
          </div>
        </div>
      ))}
    </div>
  );
}
