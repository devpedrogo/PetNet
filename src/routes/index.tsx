import { createFileRoute } from "@tanstack/react-router";
import { PetNetProvider, usePetNet } from "@/lib/petnet-store";
import {
  HomeScreen,
  LoginScreen,
  CadastroScreen,
  ListagemScreen,
  DetalheScreen,
  PublicarScreen,
  PainelScreen,
  GerenciarScreen,
  ChatScreen,
  DenunciaScreen,
} from "@/components/petnet/screens";

export const Route = createFileRoute("/")({
  component: PetNetApp,
  head: () => ({
    meta: [
      { title: "PetNet — Adoção de Pets" },
      { name: "description", content: "PetNet: encontre seu novo melhor amigo. Plataforma de adoção responsável de animais." },
    ],
  }),
});

function PetNetApp() {
  return (
    <PetNetProvider>
      <div className="min-h-screen w-full bg-[#0a0a0a] text-white">
        <ScreenRouter />
      </div>
    </PetNetProvider>
  );
}



function ScreenRouter() {
  const { screen } = usePetNet();
  switch (screen.name) {
    case "home": return <HomeScreen />;
    case "login": return <LoginScreen />;
    case "cadastro": return <CadastroScreen />;
    case "listagem": return <ListagemScreen />;
    case "detalhe": return <DetalheScreen petId={screen.petId} />;
    case "publicar": return <PublicarScreen />;
    case "painel": return <PainelScreen />;
    case "gerenciar": return <GerenciarScreen petId={screen.petId} />;
    case "chat": return <ChatScreen petId={screen.petId} />;
    case "denuncia": return <DenunciaScreen petId={screen.petId} />;
  }
}
