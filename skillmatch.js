const candidato = {
    nome: "Richer Maul",
    areaInteresse : "Front-End",
    experiencia : 0 ,
    habilidades : [
        "JavaScript",
        "HTML",
        "CSS",
        "GIT"
    ]
};

console.log ("=================================================")
console.log ("=================================================")

console.log (`Candidato:${candidato.nome}`);
console.log (`Area de Interesse: ${candidato.areaInteresse}`);
console.log (`Experiencia: ${candidato.experiencia} anos `);
console.log (`Habilidades : ${candidato.habilidades.join(",")}`);

console.log ("=================================================")
console.log ("=================================================")


class Vaga {
    constructor (empresa,cargo,requisitos){
        this.empresa = empresa;
        this.cargo = cargo;
        this.requisitos = requisitos

    }
    exibirResumo ( ){
    return `${this.empresa} - ${this.cargo}`;
    }
    
}

class VagaReact extends Vaga {
    constructor (empresa,cargo,requisitos,framework){
        super(empresa,cargo,requisitos);
        this.framework = framework
    }
    exibirResumo(){
        return `${this.empresa} - ${this.cargo} - Especializção: ${this.framework}`; 
    }
}

const vagas = [
    new Vaga (
        "TechNova",
        "Front-End Junior",
        ["JavaScript","HTML","CSS","GIT"]
    ),

    new VagaReact(
        "WebPlus",
        "Desenvolvedor React Junior",
        ["JavaScript","React","GIT","HTML","CSS"],
        "React"

    ),
    new VagaReact (
        "CodeLab",
        "Front-End Junior",
        ["JavaScript","HTML","CSS","React","GIT", "APIs" ],
        "React"

    )
];

function carregarVagas(){
 return new Promise((resolve,reject)=> {
    setTimeout(()=>{
        if (vagas.length > 0){
            resolve(vagas);
        } else{
            reject ("Não foi possível carregar as vagas.");
        }
    },2000);
 });

}

function calcularCompatibilidade(candidato,vaga){

    const requisitosAtendidos = vaga.requisitos.filter(
        requisito => candidato.habilidades.includes(requisito)
    );

    const percentual = 
        (requisitosAtendidos.length / vaga.requisitos.length)*100;
    return Math.round(percentual);

}



function classificarCompatibilidade(percentual){

    if (percentual >= 80){
        return "Alta compatibilidade";
    } else if (percentual >= 50){
        return "Média compatibilidade";
    } else {
        return "Baixa compatibilidade";
    }
}


function encontrarHabilidadesFaltantes (candidato,vaga){
    return vaga.requisitos.filter(
        requisito => !candidato.habilidades.includes(requisito)
    );
}


function encontrarMelhorVaga(resultados){
    return resultados.reduce((melhor,atual) =>{
        return atual.compatibilidade>melhor.compatibilidade
        ? atual
        : melhor;
    });
}


function gerarRecomendacao(resultados){
    
    const habilidadesFaltantes = resultados.flatMap(
        resultado => resultado.habilidadesFaltantes

    );

    const contagem = {};

    habilidadesFaltantes.forEach(habilidade =>{
        contagem[habilidade] = 
          (contagem [habilidade] || 0)+1;
    });

    const habilidadesOrdenadas= Object.entries(contagem)
        .sort((a,b) => b[1]-a[1] )
        .map (item => item[0]);
    if (habilidadesOrdenadas.length === 0) {

      return "Você possui as habilidades exigidas.";

    }

    return `Priorize seus estudos em:${habilidadesOrdenadas.join(",")}`;   
}

function executarComCallback(resultados, callback) {
    console.log("\nExecutando analise com callback...");
    
    
    callback(resultados);
}




function criarContadorAnalises(){
    let quantidade = 0;

    return function(){
       
        quantidade++;
       
        return quantidade;

    };
}


function analisarVagas(vagasCarregadas){
    //every
    const vagasValidas = vagasCarregadas.every(
        vaga =>
            Array.isArray(vaga.requisitos)&&
            vaga.requisitos.length >0
    );

    if(!vagasValidas){
        throw new Error (
            "Exixte uma vaga sem requisitos."
        );
    }

    //map
    return vagasCarregadas.map(vaga =>{

        const compatibilidade = 
            calcularCompatibilidade(candidato,vaga);

        return{
            vaga:vaga,

            compatibilidade:compatibilidade,

            classificacao:
               classificarCompatibilidade(compatibilidade),

            habilidadesFaltantes:
                encontrarHabilidadesFaltantes(
                    candidato,
                    vaga
                )   

        };

    });
}


async function executarSistema() {
    const contador = criarContadorAnalises();
    try{

        console.log(
            "\nCarregando vagas do Servidor simulado..."
        );

        const vagasCarregadas = 
            await carregarVagas();
        console.log(
            "Vagas carregadas com sucesso !"

        );
        
        const resultados =
          analisarVagas(vagasCarregadas);

        //find
        const vagaReact=resultados.find(
            resultado =>
                resultado.vaga.framework === "React"

        );
        
        if(vagaReact){
            console.log(
                `\nVaga encontrada com React:${
                    vagaReact.vaga.exibirResumo()
                }`
            );
        }
        //callback
        executarComCallback(
            resultados,
            (dados) => {
                console.log(
                    "\n============================================="
                );

                console.log(
                    "            Resultado das Vagas"
                );

                console.log(
                    "============================================="
                );

                dados.forEach(
                    (resultado,indice) => {

                        console.log(
                            `\nVAGA ${indice+1}`
                        );

                        console.log(
                            "---------------------------------------------"
                        );

                        console.log(
                            `Empresa : ${resultado.vaga.empresa}`
                        );

                        console.log (
                            `Cargo: ${resultado.vaga.cargo}`
                        );

                        console.log (
                            `Compatibilidade: ${resultado.compatibilidade}%`
                        );

                        console.log(
                            `Classificação: ${resultado.classificacao}`
                        );

                        if (
                            resultado.habilidadesFaltantes.length> 0
                        ){
                            console.log(
                                `Habilidades faltantes : ${
                                    resultado.habilidadesFaltantes.join(",")
                                }`
                            );
                        }else{
                            console.log(
                                "Habilidades faltantes :nenhuma "
                            );
                        }
                    }
                );
            }
        );


        const melhorVaga =
            encontrarMelhorVaga(resultados);

        const recomendacao =
            gerarRecomendacao(resultados);
           
        const totalAnalises =
           contador();   
        
        console.log(
            "\n=============================================="
        );

        console.log(
            "               Melhor Vaga"
        );

        console.log(
            "\n=============================================="
        );
        console.log(
            `Empresa: ${melhorVaga.vaga.empresa}`
        );

        console.log(
            `Cargo: ${melhorVaga.vaga.cargo}`
        );
        
        console.log(
            `Compatibilidade: ${melhorVaga.compatibilidade}%`
        );

        console.log(
            `Classificação: ${melhorVaga.classificacao}`
        );

        console.log(
            "\n==================================================="
        );

        console.log(
            "               Recomendação de Estudo"
        );

        console.log(
            "\n==================================================="
        );

        console.log(recomendacao);


        console.log(
            "\n==================================================="
        );

        console.log(
        `Análises realizadas: ${totalAnalises}`
        );

        console.log(
            "Sistema finalizadocom sucesso!"
        );

        console.log(
            "======================================================="
        );

    }catch (erro){
        console.error(
            "\nErro ao executar o SkillMatch JS",
            erro

        );


    }





    
    
}

executarSistema();
