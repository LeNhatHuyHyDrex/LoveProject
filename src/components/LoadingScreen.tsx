export const LoadingScreen = ({ label = 'Đang chuẩn bị điều dịu dàng...' }: { label?: string }) => (
  <div className="grid min-h-screen place-items-center bg-[#160919] px-6 text-center text-rose-50">
    <div>
      <div className="mx-auto mb-5 h-12 w-12 rounded-full border-2 border-rose-200/20 border-t-amber-200 animate-spin" />
      <p className="text-sm tracking-[0.28em] text-rose-100/70 uppercase">{label}</p>
    </div>
  </div>
);
