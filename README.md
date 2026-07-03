# 🌿 Plantae Acessível

O **Plantae Acessível** é um sistema web desenvolvido com foco em acessibilidade. A plataforma permite o gerenciamento completo de jardins, oferecendo recursos interativos para visitantes e ferramentas robustas de gestão para administradores e jardineiros.

## 🚀 Funcionalidades

* **Catálogo Público Dinâmico:** Visitantes podem explorar os jardins e visualizar os detalhes, cuidados e fotos de cada planta.
* **Acessibilidade:** Suporte planejado para Audiodescrição e Libras (via interface).
* **Painel de Gestão (Admin/Jardineiro):** * 🌳 **Jardins:** CRUD completo para mapear múltiplos espaços físicos.
  * 🌿 **Plantas:** Gestão de espécies, integrando URLs de imagens e informações de cuidados botânicos.
  * 🛠️ **Manutenções:** Registro de atividades realizadas nos jardins.
  * 📋 **Tarefas:** Controle de demandas pendentes e concluídas com definição de prazos.
  * 📱 **Tags NFC:** Vínculo inteligente (Filtros em Cascata) entre plantas e identificadores NFC para interação física no jardim.

## 🛠️ Tecnologias Utilizadas

**Front-end:**
* HTML5, CSS3 e JavaScript Vanilla.
* Consumo de API via `fetch`.

**Back-end:**
* Java 21+
* Spring Boot (Spring Web, Spring Data JPA, Validation)
* Banco de Dados: MySQL (Local) / PostgreSQL (Nuvem)

## ⚙️ Como Executar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/sabrinaev/ICjardimAcessivel.git](https://github.com/sabrinaev/ICjardimAcessivel.git)