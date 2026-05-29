import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Send,
  Plus,
  Search,
  PawPrint,
  MessageCircle,
  CheckCircle2,
  Flag,
  Home,
  User,
  ChevronDown,
  Camera,
  Heart,
  LogOut,
} from "lucide-react";
import { usePetNet, type PetStatus, type Pet } from "@/lib/petnet-store";

/* ============ Layout primitives ============ */

const Logo = ({ size = "md" }: { size?: "md" | "lg" }) => (
  <div className="flex items-center gap-2">
    <PawPrint className={size === "lg" ? "size-7 text-primary" : "size-5 text-primary"} />
    <span className={size === "lg" ? "text-2xl font-bold text-white" : "text-lg font-bold text-white"}>
      PetNet
    </span>
  </div>
);

const TopNav = () => {
  const { go, screen, user, logout } = usePetNet();
  const cur = screen.name;
  const NavLink = ({ active, icon, label, onClick }: { active: boolean; icon: ReactNode; label: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
        active ? "bg-primary/15 text-primary" : "text-white/70 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <button onClick={() => go({ name: "home" })} className="shrink-0">
          <Logo />
        </button>
        <nav className="flex items-center gap-1">
          <NavLink active={cur === "home"} icon={<Home className="size-4" />} label="Início" onClick={() => go({ name: "home" })} />
          <NavLink active={cur === "listagem"} icon={<Search className="size-4" />} label="Buscar" onClick={() => go({ name: "listagem" })} />
          {user && (
            <>
              <NavLink active={cur === "chat"} icon={<MessageCircle className="size-4" />} label="Chats" onClick={() => go({ name: "chat", petId: "rex" })} />
              <NavLink active={cur === "painel" || cur === "publicar" || cur === "gerenciar"} icon={<User className="size-4" />} label="Minha conta" onClick={() => go({ name: "painel" })} />
            </>
          )}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <>
              <button
                onClick={() => go({ name: "publicar" })}
                className="hidden md:inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90"
              >
                <Plus className="size-4" /> Publicar
              </button>
              <button
                onClick={logout}
                className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white"
                aria-label="Sair"
              >
                <LogOut className="size-4" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => go({ name: "login" })} className="rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-white hover:bg-white/5">
                Entrar
              </button>
              <button onClick={() => go({ name: "cadastro" })} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90">
                Cadastrar
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const Page = ({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) => (
  <main className={`mx-auto w-full px-4 py-6 md:px-8 md:py-10 ${narrow ? "max-w-3xl" : "max-w-7xl"}`}>
    {children}
  </main>
);

const PageHeader = ({ title }: { title: string }) => {
  const { back } = usePetNet();
  return (
    <div className="mb-6 flex items-center gap-3">
      <button onClick={back} className="rounded-full border border-white/10 p-2 hover:bg-white/5" aria-label="Voltar">
        <ArrowLeft className="size-4 text-white" />
      </button>
      <h1 className="text-xl font-semibold text-white md:text-2xl">{title}</h1>
    </div>
  );
};

const Pill = ({ children }: { children: ReactNode }) => (
  <button className="flex items-center gap-1 rounded-full border border-white/10 bg-card px-4 py-2 text-sm text-white/90 hover:border-white/20">
    {children}
    <ChevronDown className="size-3.5 opacity-70" />
  </button>
);

const StatusBadge = ({ status }: { status: PetStatus }) => {
  const cls =
    status === "Disponível"
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
      : status === "Em adoção"
        ? "bg-primary/15 text-primary border-primary/40"
        : "bg-white/10 text-white/70 border-white/15";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cls}`}>
      {status}
    </span>
  );
};

const Input = ({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-medium text-white/70">{label}</span>
    <input
      {...p}
      className="w-full rounded-xl border border-white/10 bg-card px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
    />
  </label>
);

const Select = ({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-medium text-white/70">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-white/10 bg-card px-4 py-3 text-sm text-white focus:border-primary focus:outline-none"
    >
      <option value="" disabled>Selecione...</option>
      {options.map((o) => (
        <option key={o} value={o} className="bg-card">
          {o}
        </option>
      ))}
    </select>
  </label>
);

const PetCard = ({ pet, onClick }: { pet: Pet; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="group overflow-hidden rounded-xl bg-card text-left transition hover:ring-2 hover:ring-primary/40"
  >
    <div className="aspect-square overflow-hidden bg-muted">
      <img
        src={pet.fotos[0]}
        alt={pet.nome}
        className="size-full object-cover transition group-hover:scale-105"
        loading="lazy"
      />
    </div>
    <div className="p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="truncate text-sm font-semibold text-white">{pet.nome}</div>
        <StatusBadge status={pet.status} />
      </div>
      <div className="mt-1 text-[11px] leading-tight text-white/60">
        {pet.especie} • {pet.raca} • {pet.sexo} • {pet.idade}
      </div>
    </div>
  </button>
);

/* ============ 01. Home ============ */
export function HomeScreen() {
  const { pets, go } = usePetNet();
  return (
    <>
      <TopNav />
      <Page>
        <section className="grid items-center gap-8 rounded-2xl border border-white/10 bg-gradient-to-br from-primary/15 via-card to-card p-6 md:grid-cols-2 md:p-12">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
              <PawPrint className="size-3.5" /> Adoção responsável
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-white md:text-5xl">
              Encontre seu novo<br />melhor amigo
            </h1>
            <p className="mt-4 max-w-md text-sm text-white/70 md:text-base">
              Conectamos pessoas, ONGs e animais que esperam por um lar. Adote, doe ou divulgue —
              tudo em um só lugar.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Pill>Espécie</Pill>
              <Pill>Porte</Pill>
              <Pill>Sexo</Pill>
              <button
                onClick={() => go({ name: "listagem" })}
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Ver todos os animais
              </button>
            </div>
          </div>
          <div className="hidden grid-cols-2 gap-3 md:grid">
            {pets.slice(0, 4).map((p) => (
              <img
                key={p.id}
                src={p.fotos[0]}
                alt={p.nome}
                className="aspect-square w-full rounded-xl object-cover"
              />
            ))}
          </div>
        </section>

        <div className="mt-10 flex items-end justify-between">
          <h2 className="text-lg font-semibold text-white md:text-xl">Animais disponíveis</h2>
          <button
            onClick={() => go({ name: "listagem" })}
            className="text-sm text-primary hover:underline"
          >
            Ver todos →
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {pets.map((p) => (
            <PetCard key={p.id} pet={p} onClick={() => go({ name: "detalhe", petId: p.id })} />
          ))}
        </div>
      </Page>
    </>
  );
}

/* ============ 02. Login ============ */
export function LoginScreen() {
  const { go, login } = usePetNet();
  return (
    <>
      <TopNav />
      <Page narrow>
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-card p-8">
          <div className="flex flex-col items-center">
            <Logo size="lg" />
            <p className="mt-2 text-sm text-white/60">Bem-vindo de volta</p>
          </div>
          <div className="mt-8 space-y-3">
            <Input label="E-mail" type="email" placeholder="seu@email.com" />
            <Input label="Senha" type="password" placeholder="••••••••" />
          </div>
          <button
            onClick={() => {
              login();
              go({ name: "painel" });
            }}
            className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-bold tracking-wide text-white hover:bg-primary/90"
          >
            ENTRAR
          </button>
          <button onClick={() => go({ name: "cadastro" })} className="mt-5 block w-full text-center text-sm text-white/70">
            Não tem conta? <span className="font-semibold text-primary">Cadastrar</span>
          </button>
        </div>
      </Page>
    </>
  );
}

/* ============ 03. Cadastro ============ */
export function CadastroScreen() {
  const { go, login } = usePetNet();
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState<"Pessoa Física" | "ONG / Empresa" | null>(null);
  return (
    <>
      <TopNav />
      <Page narrow>
        <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-card p-8">
          <div className="mb-6 text-xs text-white/60">Passo {step} de 2</div>
          {step === 1 ? (
            <>
              <h1 className="text-2xl font-bold text-white">Quem é você?</h1>
              <p className="mt-1 text-sm text-white/60">Escolha seu tipo de conta</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {(["Pessoa Física", "ONG / Empresa"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTipo(t)}
                    className={`flex flex-col items-start gap-3 rounded-xl border p-5 text-left ${
                      tipo === t ? "border-primary bg-primary/10" : "border-white/10 bg-[#0f0f0f]"
                    }`}
                  >
                    <div className={`flex size-11 items-center justify-center rounded-full ${tipo === t ? "bg-primary" : "bg-white/10"}`}>
                      {t === "Pessoa Física" ? <User className="size-5 text-white" /> : <Heart className="size-5 text-white" />}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{t}</div>
                      <div className="text-xs text-white/60">
                        {t === "Pessoa Física" ? "Adotar ou doar um pet" : "Promover adoções responsáveis"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                disabled={!tipo}
                onClick={() => setStep(2)}
                className="mt-8 w-full rounded-xl bg-primary py-3 text-sm font-bold tracking-wide text-white disabled:opacity-40"
              >
                CONTINUAR
              </button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white">Seus dados</h1>
              <p className="mt-1 text-sm text-white/60">{tipo}</p>
              <div className="mt-6 space-y-3">
                {tipo === "ONG / Empresa" ? (
                  <>
                    <Input label="Nome da ONG" placeholder="Ex.: Patinhas Felizes" />
                    <Input label="CNPJ" placeholder="00.000.000/0000-00" />
                  </>
                ) : (
                  <Input label="Nome Completo" placeholder="Seu nome" />
                )}
                <Input label="E-mail" type="email" placeholder="seu@email.com" />
                <Input label="Senha" type="password" placeholder="••••••••" />
              </div>
              <button
                onClick={() => {
                  login();
                  go({ name: "painel" });
                }}
                className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-bold tracking-wide text-white"
              >
                CADASTRAR
              </button>
            </>
          )}
        </div>
      </Page>
    </>
  );
}

/* ============ 04. Listagem ============ */
export function ListagemScreen() {
  const { pets, go } = usePetNet();
  const [shown, setShown] = useState(pets.length);
  return (
    <>
      <TopNav />
      <Page>
        <PageHeader title="Buscar animais" />
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-3 rounded-2xl border border-white/10 bg-card p-5 lg:sticky lg:top-20 lg:self-start">
            <h2 className="text-sm font-semibold text-white">Filtros</h2>
            <Select label="Espécie" options={["Cão", "Gato", "Outro"]} value="" onChange={() => {}} />
            <Select label="Porte" options={["Pequeno", "Médio", "Grande"]} value="" onChange={() => {}} />
            <Select label="Sexo" options={["Macho", "Fêmea"]} value="" onChange={() => {}} />
            <Select label="Idade" options={["Filhote", "Adulto", "Idoso"]} value="" onChange={() => {}} />
            <Select label="Estado" options={["SP", "RJ", "MG", "RS", "PR"]} value="" onChange={() => {}} />
            <Input label="Raça" placeholder="Ex.: Golden Retriever" />
          </aside>
          <div>
            <div className="mb-3 text-sm text-white/70">{pets.length} animais encontrados</div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {pets.slice(0, shown).map((p) => (
                <PetCard key={p.id} pet={p} onClick={() => go({ name: "detalhe", petId: p.id })} />
              ))}
            </div>
            <button
              onClick={() => setShown((s) => s + 4)}
              className="mt-6 w-full rounded-xl border border-white/15 py-3 text-sm font-medium text-white hover:bg-white/5"
            >
              Carregar Mais
            </button>
          </div>
        </div>
      </Page>
    </>
  );
}

/* ============ 05. Detalhe ============ */
export function DetalheScreen({ petId }: { petId: string }) {
  const { pets, go } = usePetNet();
  const pet = pets.find((p) => p.id === petId);
  if (!pet) return null;
  return (
    <>
      <TopNav />
      <Page>
        <PageHeader title={pet.nome} />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl bg-card">
            <img src={pet.fotos[0]} alt={pet.nome} className="aspect-square w-full object-cover" />
            <button
              onClick={() => go({ name: "denuncia", petId: pet.id })}
              className="absolute right-3 top-3 rounded-full bg-black/50 p-2 backdrop-blur hover:bg-black/70"
              aria-label="Denunciar"
            >
              <Flag className="size-4 text-white" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-white">{pet.nome}</h2>
              <StatusBadge status={pet.status} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                ["Espécie", pet.especie],
                ["Raça", pet.raca],
                ["Sexo", pet.sexo],
                ["Idade", pet.idade],
                ["Porte", pet.porte],
              ].map(([k, v]) => (
                <span key={k} className="rounded-full bg-card px-3 py-1 text-xs text-white/80">
                  <span className="text-white/50">{k}:</span> {v}
                </span>
              ))}
            </div>
            <h3 className="mt-6 text-sm font-semibold text-white">Sobre</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{pet.descricao}</p>
            <div className="mt-6 rounded-xl border border-white/10 bg-card p-4">
              <div className="text-[11px] text-white/50">Anunciado por</div>
              <div className="text-sm font-semibold text-white">{pet.anunciante}</div>
              <div className="mt-2 text-[11px] text-white/50">Publicado em: {pet.publicadoEm}</div>
            </div>
            <button
              onClick={() => go({ name: "chat", petId: pet.id })}
              className="mt-6 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white hover:bg-primary/90"
            >
              Tenho interesse
            </button>
          </div>
        </div>
      </Page>
    </>
  );
}

/* ============ 06. Publicar ============ */
export function PublicarScreen() {
  const { addPet, go } = usePetNet();
  const [form, setForm] = useState({
    nome: "",
    especie: "" as "Cão" | "Gato" | "",
    porte: "" as "Pequeno" | "Médio" | "Grande" | "",
    sexo: "" as "Macho" | "Fêmea" | "",
    idade: "",
    raca: "",
    descricao: "",
    foto: false,
  });
  const valid = form.nome && form.especie && form.porte && form.sexo && form.idade && form.foto;
  return (
    <>
      <TopNav />
      <Page narrow>
        <PageHeader title="Publicar anúncio" />
        <div className="rounded-2xl border border-white/10 bg-card p-6 md:p-8">
          <div className="grid gap-3 md:grid-cols-2">
            <Input label="Nome do animal *" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            <Select
              label="Espécie *"
              options={["Cão", "Gato"]}
              value={form.especie}
              onChange={(v) => setForm({ ...form, especie: v as "Cão" | "Gato" })}
            />
            <Select
              label="Porte *"
              options={["Pequeno", "Médio", "Grande"]}
              value={form.porte}
              onChange={(v) => setForm({ ...form, porte: v as "Pequeno" | "Médio" | "Grande" })}
            />
            <div>
              <span className="mb-1.5 block text-xs font-medium text-white/70">Sexo *</span>
              <div className="flex gap-2">
                {(["Macho", "Fêmea"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setForm({ ...form, sexo: s })}
                    className={`flex-1 rounded-xl border py-3 text-sm ${
                      form.sexo === s ? "border-primary bg-primary/10 text-primary" : "border-white/10 bg-[#0f0f0f] text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <Input label="Idade aproximada *" placeholder="Ex.: 2 anos" value={form.idade} onChange={(e) => setForm({ ...form, idade: e.target.value })} />
            <Input label="Raça" value={form.raca} onChange={(e) => setForm({ ...form, raca: e.target.value })} />
          </div>
          <label className="mt-3 block">
            <span className="mb-1.5 block text-xs font-medium text-white/70">Descrição</span>
            <textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
              placeholder="Conte um pouco sobre o animal..."
            />
          </label>
          <div className="mt-3">
            <span className="mb-1.5 block text-xs font-medium text-white/70">Fotos *</span>
            <button
              onClick={() => setForm({ ...form, foto: !form.foto })}
              className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 ${
                form.foto ? "border-primary bg-primary/5 text-primary" : "border-white/15 bg-[#0f0f0f] text-white/60"
              }`}
            >
              <Camera className="size-8" />
              <span className="text-xs">{form.foto ? "Foto selecionada ✓" : "Clique para selecionar fotos"}</span>
            </button>
          </div>
          <button
            disabled={!valid}
            onClick={() => {
              addPet({
                nome: form.nome,
                especie: form.especie as "Cão" | "Gato",
                raca: form.raca || "SRD",
                sexo: form.sexo as "Macho" | "Fêmea",
                idade: form.idade,
                porte: form.porte as "Pequeno" | "Médio" | "Grande",
                descricao: form.descricao || "Sem descrição.",
                fotos: ["https://placehold.co/512x512/1a1a1a/ff6b00?text=" + encodeURIComponent(form.nome)],
              });
              go({ name: "painel" });
            }}
            className="mt-6 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white disabled:opacity-40 hover:bg-primary/90"
          >
            Confirmar
          </button>
        </div>
      </Page>
    </>
  );
}

/* ============ 07. Painel ============ */
export function PainelScreen() {
  const { user, pets, go } = usePetNet();
  const meus = pets.filter((p) => p.ownerId === "maria");
  const ativos = meus.filter((p) => p.status !== "Adotado").length;
  const adotados = meus.filter((p) => p.status === "Adotado").length;
  return (
    <>
      <TopNav />
      <Page>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Olá, {user?.nome ?? "Visitante"} 👋</h1>
            <p className="text-sm text-white/60">{user?.tipo ?? "Convidado"}</p>
          </div>
          <button
            onClick={() => go({ name: "publicar" })}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90"
          >
            <Plus className="size-4" /> Publicar novo animal
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          <StatCard icon={<PawPrint className="size-5 text-primary" />} value={ativos} label="Anúncios ativos" />
          <StatCard icon={<MessageCircle className="size-5 text-primary" />} value={2} label="Chats abertos" />
          <StatCard icon={<CheckCircle2 className="size-5 text-emerald-400" />} value={adotados || 1} label="Adotados" />
        </div>

        <h2 className="mt-8 text-lg font-semibold text-white">Meus anúncios</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {meus.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-card p-3">
              <img src={p.fotos[0]} alt={p.nome} className="size-14 rounded-lg object-cover" loading="lazy" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">{p.nome}</div>
                <div className="mt-0.5 text-xs text-white/60">{p.raca} • {p.idade}</div>
                <div className="mt-1"><StatusBadge status={p.status} /></div>
              </div>
              <button
                onClick={() => go({ name: "gerenciar", petId: p.id })}
                className="rounded-full border border-primary px-4 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
              >
                Gerenciar
              </button>
            </div>
          ))}
        </div>
      </Page>
    </>
  );
}

const StatCard = ({ icon, value, label }: { icon: ReactNode; value: number; label: string }) => (
  <div className="rounded-xl border border-white/10 bg-card p-4">
    <div className="mb-2">{icon}</div>
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-xs leading-tight text-white/60">{label}</div>
  </div>
);

/* ============ 08. Gerenciar ============ */
export function GerenciarScreen({ petId }: { petId: string }) {
  const { pets, setPetStatus } = usePetNet();
  const pet = pets.find((p) => p.id === petId);
  if (!pet) return null;
  const opts: PetStatus[] = ["Disponível", "Em adoção", "Adotado"];
  return (
    <>
      <TopNav />
      <Page narrow>
        <PageHeader title="Gerenciar anúncio" />
        <div className="rounded-2xl border border-white/10 bg-card p-6">
          <div className="flex items-center gap-4">
            <img src={pet.fotos[0]} alt={pet.nome} className="size-20 rounded-xl object-cover" />
            <div>
              <div className="text-xl font-bold text-white">{pet.nome}</div>
              <div className="text-sm text-white/60">{pet.raca} • {pet.idade}</div>
              <div className="mt-1.5"><StatusBadge status={pet.status} /></div>
            </div>
          </div>

          <h2 className="mt-8 text-sm font-semibold text-white">Status da adoção</h2>
          <p className="text-xs text-white/60">Atualize o estado do anúncio</p>
          <div className="mt-3 space-y-2">
            {opts.map((o) => (
              <button
                key={o}
                onClick={() => setPetStatus(pet.id, o)}
                className={`flex w-full items-center justify-between rounded-xl border p-4 ${
                  pet.status === o ? "border-primary bg-primary/10" : "border-white/10 bg-[#0f0f0f]"
                }`}
              >
                <span className="text-sm font-medium text-white">{o === "Em adoção" ? "Em processo de adoção" : o}</span>
                {pet.status === o && <CheckCircle2 className="size-5 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      </Page>
    </>
  );
}

/* ============ 09. Chat ============ */
export function ChatScreen({ petId }: { petId: string }) {
  const { pets, messages, sendMessage } = usePetNet();
  const pet = pets.find((p) => p.id === petId);
  const [text, setText] = useState("");
  const msgs = messages.filter((m) => m.petId === petId);
  if (!pet) return null;
  return (
    <>
      <TopNav />
      <Page narrow>
        <div className="flex h-[calc(100vh-10rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-card">
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <img src={pet.fotos[0]} alt={pet.nome} className="size-10 rounded-full object-cover" />
            <div>
              <div className="text-sm font-semibold text-white">{pet.nome}</div>
              <div className="text-[11px] text-white/60">{pet.anunciante}</div>
            </div>
          </div>
          <div className="border-b border-white/10 bg-primary/5 px-4 py-2 text-[11px] text-primary">
            Anúncio: {pet.nome.toUpperCase()} ({pet.raca} - {pet.idade})
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((m) => (
              <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-3.5 py-2 text-sm ${
                  m.from === "me" ? "bg-primary text-white" : "bg-[#0f0f0f] text-white"
                }`}>
                  <div>{m.text}</div>
                  <div className={`mt-1 text-[10px] ${m.from === "me" ? "text-white/70" : "text-white/40"}`}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-white/10 p-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && text.trim()) {
                  sendMessage(petId, text.trim());
                  setText("");
                }
              }}
              placeholder="Escreva uma mensagem..."
              className="flex-1 rounded-full border border-white/10 bg-[#0f0f0f] px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none"
            />
            <button
              onClick={() => {
                if (text.trim()) {
                  sendMessage(petId, text.trim());
                  setText("");
                }
              }}
              className="flex size-11 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90"
              aria-label="Enviar"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </Page>
    </>
  );
}

/* ============ 10. Denúncia ============ */
export function DenunciaScreen({ petId }: { petId: string }) {
  const { pets } = usePetNet();
  const pet = pets.find((p) => p.id === petId);
  const [motivo, setMotivo] = useState<string>("");
  const [desc, setDesc] = useState("");
  const [sent, setSent] = useState(false);
  const opts = ["Anúncio falso", "Maus-tratos", "Outros"];
  return (
    <>
      <TopNav />
      <Page narrow>
        <PageHeader title="Denunciar anúncio" />
        <div className="rounded-2xl border border-white/10 bg-card p-6 md:p-8">
          {sent ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
              <CheckCircle2 className="mx-auto size-10 text-emerald-400" />
              <div className="mt-3 font-semibold text-white">Denúncia enviada</div>
              <p className="mt-1 text-xs text-white/60">Nossa equipe vai analisar em breve. Obrigado!</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-white/60">Reportando: <span className="text-white">{pet?.nome}</span></p>
              <h2 className="mt-5 text-sm font-semibold text-white">Motivo</h2>
              <div className="mt-2 space-y-2">
                {opts.map((o) => (
                  <button
                    key={o}
                    onClick={() => setMotivo(o)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-sm ${
                      motivo === o ? "border-primary bg-primary/10 text-primary" : "border-white/10 bg-[#0f0f0f] text-white"
                    }`}
                  >
                    {o}
                    {motivo === o && <CheckCircle2 className="size-4" />}
                  </button>
                ))}
              </div>
              <label className="mt-5 block">
                <span className="mb-1.5 block text-xs font-medium text-white/70">Descrição</span>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={4}
                  placeholder="Descreva o que aconteceu..."
                  className="w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
                />
              </label>
              <button
                disabled={!motivo}
                onClick={() => setSent(true)}
                className="mt-6 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white disabled:opacity-40 hover:bg-primary/90"
              >
                Enviar Denúncia
              </button>
            </>
          )}
        </div>
      </Page>
    </>
  );
}
