let usuarios = [];
let usuarioLogado = null;

// Carregar JSON
fetch('usuarios.json')
    .then(res => res.json())
    .then(data => {
        usuarios = data;
        salvarUsuariosLocal();
    })
    .catch(err => console.error('Erro ao carregar JSON:', err));

// Salvar dados no localStorage (simula persistência)
function salvarUsuariosLocal() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// Carregar dados do localStorage
function carregarUsuariosLocal() {
    const dados = localStorage.getItem('usuarios');
    if (dados) {
        usuarios = JSON.parse(dados);
    }
}

// Login
function fazerLogin() {
    carregarUsuariosLocal();
    const user = document.getElementById('loginUser').value;
    const senha = document.getElementById('loginSenha').value;

    const usuario = usuarios.find(u => u.usuario === user && u.senha === senha);

    if (usuario) {
        usuarioLogado = usuario;
        document.getElementById('login').classList.add('hidden');
        document.getElementById('cadastro').classList.add('hidden');
        document.getElementById('painel').classList.remove('hidden');
        document.getElementById('bemVindo').innerText = `Bem-vindo, ${usuario.usuario} (${usuario.funcao})`;
        exibirDados();
    } else {
        alert('Usuário ou senha inválidos');
    }
}

// Cadastro
function cadastrarUsuario() {
    const user = document.getElementById('cadUser').value;
    const senha = document.getElementById('cadSenha').value;
    const funcao = document.getElementById('cadFuncao').value;

    if (usuarios.some(u => u.usuario === user)) {
        alert('Usuário já existe!');
        return;
    }

    const novoUsuario = { usuario: user, senha: senha, funcao: funcao };
    usuarios.push(novoUsuario);
    salvarUsuariosLocal();
    alert('Usuário cadastrado com sucesso!');
}

// Painel
function exibirDados() {
    const dadosDiv = document.getElementById('dadosUsuario');
    const tabelaDiv = document.getElementById('tabelaUsuarios');

    dadosDiv.innerHTML = '';
    tabelaDiv.innerHTML = '';

    if (usuarioLogado.funcao === 'ADM') {
        criarTabelaADM(tabelaDiv);
    } else if (usuarioLogado.funcao === 'Supervisor') {
        criarTabelaSupervisor(tabelaDiv);
    } else if (usuarioLogado.funcao === 'Especialista') {
        dadosDiv.innerHTML = `
            <h3>Seus Dados:</h3>
            <p>Usuário: ${usuarioLogado.usuario}</p>
            <p>Função: ${usuarioLogado.funcao}</p>
            <button onclick="editarMeusDados()">Editar Meus Dados</button>
        `;
    }
}

// Tabela para ADM
function criarTabelaADM(div) {
    let html = `
        <h3>Lista de Usuários</h3>
        <table>
            <tr><th>Usuário</th><th>Função</th><th>Ações</th></tr>
    `;
    usuarios.forEach((u, i) => {
        html += `
            <tr>
                <td>${u.usuario}</td>
                <td>${u.funcao}</td>
                <td>
                    <button onclick="editarUsuario(${i})">Editar</button>
                    <button onclick="excluirUsuario(${i})">Excluir</button>
                </td>
            </tr>
        `;
    });
    html += '</table>';
    div.innerHTML = html;
}

// Tabela para Supervisor
function criarTabelaSupervisor(div) {
    let html = `
        <h3>Usuários (Nomes e Funções)</h3>
        <table>
            <tr><th>Usuário</th><th>Função</th></tr>
    `;
    usuarios.forEach((u) => {
        html += `
            <tr>
                <td>${u.usuario}</td>
                <td>${u.funcao}</td>
            </tr>
        `;
    });
    html += '</table>';

    html += `
        <h3>Seus Dados</h3>
        <p>Usuário: ${usuarioLogado.usuario}</p>
        <p>Função: ${usuarioLogado.funcao}</p>
        <button onclick="editarMeusDados()">Editar Meus Dados</button>
    `;
    div.innerHTML = html;
}

// Editar seus próprios dados
function editarMeusDados() {
    const novoUser = prompt('Novo nome de usuário:', usuarioLogado.usuario);
    const novaSenha = prompt('Nova senha:', usuarioLogado.senha);

    if (novoUser && novaSenha) {
        usuarios = usuarios.map(u => {
            if (u.usuario === usuarioLogado.usuario) {
                return { ...u, usuario: novoUser, senha: novaSenha };
            }
            return u;
        });
        usuarioLogado.usuario = novoUser;
        usuarioLogado.senha = novaSenha;
        salvarUsuariosLocal();
        alert('Dados atualizados!');
        exibirDados();
    }
}

// Editar qualquer usuário (ADM)
function editarUsuario(index) {
    const user = usuarios[index];
    const novoUser = prompt('Novo nome de usuário:', user.usuario);
    const novaSenha = prompt('Nova senha:', user.senha);
    const novaFuncao = prompt('Nova função (ADM, Supervisor, Especialista):', user.funcao);

    if (novoUser && novaSenha && novaFuncao) {
        usuarios[index] = { usuario: novoUser, senha: novaSenha, funcao: novaFuncao };
        salvarUsuariosLocal();
        exibirDados();
    }
}

// Excluir (ADM)
function excluirUsuario(index) {
    if (confirm('Deseja realmente excluir este usuário?')) {
        usuarios.splice(index, 1);
        salvarUsuariosLocal();
        exibirDados();
    }
}

// Logout
function logout() {
    usuarioLogado = null;
    document.getElementById('login').classList.remove('hidden');
    document.getElementById('cadastro').classList.remove('hidden');
    document.getElementById('painel').classList.add('hidden');
}
