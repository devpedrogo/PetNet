import { createContext, useContext, useState, type ReactNode } from "react";
import rex from "@/assets/rex.jpg";
import mel from "@/assets/mel.jpg";
import luna from "@/assets/luna.jpg";
import thor from "@/assets/thor.jpg";

export type PetStatus = "Disponível" | "Em adoção" | "Adotado";

export type Pet = {
  id: string;
  nome: string;
  especie: "Cão" | "Gato";
  raca: string;
  sexo: "Macho" | "Fêmea";
  idade: string;
  porte: "Pequeno" | "Médio" | "Grande";
  descricao: string;
  fotos: string[];
  anunciante: string;
  publicadoEm: string;
  status: PetStatus;
  ownerId: string;
};

export type Message = {
  id: string;
  petId: string;
  from: "me" | "them";
  text: string;
  time: string;
};

export type Screen =
  | { name: "home" }
  | { name: "login" }
  | { name: "cadastro" }
  | { name: "listagem" }
  | { name: "detalhe"; petId: string }
  | { name: "publicar" }
  | { name: "painel" }
  | { name: "gerenciar"; petId: string }
  | { name: "chat"; petId: string }
  | { name: "denuncia"; petId: string };

const initialPets: Pet[] = [
  {
    id: "rex",
    nome: "Rex",
    especie: "Cão",
    raca: "Golden Retriever",
    sexo: "Macho",
    idade: "2 anos",
    porte: "Médio",
    descricao:
      "Rex é muito carinhoso e brincalhão, adora passear e brincar com bola. Procurando uma família que o ame muito!",
    fotos: [rex],
    anunciante: "ONG Patinhas Felizes",
    publicadoEm: "05/04/2026",
    status: "Disponível",
    ownerId: "maria",
  },
  {
    id: "mel",
    nome: "Mel",
    especie: "Gato",
    raca: "SRD",
    sexo: "Fêmea",
    idade: "1 ano",
    porte: "Pequeno",
    descricao: "Mel é dócil e adora carinho. Convive bem com outros gatos.",
    fotos: [mel],
    anunciante: "Maria",
    publicadoEm: "10/04/2026",
    status: "Em adoção",
    ownerId: "maria",
  },
  {
    id: "luna",
    nome: "Luna",
    especie: "Cão",
    raca: "Labrador",
    sexo: "Fêmea",
    idade: "3 anos",
    porte: "Grande",
    descricao: "Luna é uma cadela amorosa, gosta de crianças e de longas caminhadas.",
    fotos: [luna],
    anunciante: "ONG Patinhas Felizes",
    publicadoEm: "12/04/2026",
    status: "Disponível",
    ownerId: "ong",
  },
  {
    id: "thor",
    nome: "Thor",
    especie: "Cão",
    raca: "SRD",
    sexo: "Macho",
    idade: "6 meses",
    porte: "Médio",
    descricao: "Thor é cheio de energia, ideal para famílias ativas.",
    fotos: [thor],
    anunciante: "Maria",
    publicadoEm: "15/04/2026",
    status: "Disponível",
    ownerId: "maria",
  },
];

const initialMessages: Message[] = [
  { id: "m1", petId: "rex", from: "me", text: "Olá! Tenho interesse em adotar o Rex!", time: "10:32" },
  { id: "m2", petId: "rex", from: "them", text: "Oi! Que ótimo! Pode me contar um pouco sobre você?", time: "10:35" },
];

type Ctx = {
  screen: Screen;
  go: (s: Screen) => void;
  back: () => void;
  pets: Pet[];
  setPetStatus: (id: string, s: PetStatus) => void;
  addPet: (p: Omit<Pet, "id" | "status" | "ownerId" | "anunciante" | "publicadoEm">) => void;
  messages: Message[];
  sendMessage: (petId: string, text: string) => void;
  user: { nome: string; tipo: "Pessoa Física" | "ONG / Empresa" } | null;
  login: () => void;
  logout: () => void;
};

const PetNetCtx = createContext<Ctx | null>(null);

export function PetNetProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<Screen[]>([{ name: "home" }]);
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [user, setUser] = useState<Ctx["user"]>({ nome: "Maria", tipo: "Pessoa Física" });

  const go = (s: Screen) => setHistory((h) => [...h, s]);
  const back = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));

  const setPetStatus: Ctx["setPetStatus"] = (id, s) =>
    setPets((ps) => ps.map((p) => (p.id === id ? { ...p, status: s } : p)));

  const addPet: Ctx["addPet"] = (p) => {
    const id = `pet-${Date.now()}`;
    setPets((ps) => [
      ...ps,
      {
        ...p,
        id,
        status: "Disponível",
        ownerId: "maria",
        anunciante: user?.nome ?? "Maria",
        publicadoEm: new Date().toLocaleDateString("pt-BR"),
      },
    ]);
  };

  const sendMessage: Ctx["sendMessage"] = (petId, text) => {
    const time = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    setMessages((m) => [...m, { id: `m-${Date.now()}`, petId, from: "me", text, time }]);
  };

  return (
    <PetNetCtx.Provider
      value={{
        screen: history[history.length - 1],
        go,
        back,
        pets,
        setPetStatus,
        addPet,
        messages,
        sendMessage,
        user,
        login: () => setUser({ nome: "Maria", tipo: "Pessoa Física" }),
        logout: () => setUser(null),
      }}
    >
      {children}
    </PetNetCtx.Provider>
  );
}

export function usePetNet() {
  const c = useContext(PetNetCtx);
  if (!c) throw new Error("PetNetProvider missing");
  return c;
}
