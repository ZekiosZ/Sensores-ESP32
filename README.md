# Tutorial: Implementação de Sensores no ESP32 e Integração com IoT

## 1. Introdução

Neste projeto, será demonstrada a implementação prática de sensores no ESP32, utilizando:

Sensor DHT11 para medição de temperatura e umidade;

Sensor LDR para medição de luminosidade.

Os dados coletados serão enviados via protocolo MQTT para o aplicativo MyMQTT, permitindo a leitura e o monitoramento remoto em um ambiente IoT.

## 2. Objetivos

Implementar sensores DHT11 e LDR no microcontrolador ESP32;

Realizar a comunicação entre o ESP32 e o aplicativo MyMQTT;

Demonstrar a publicação e leitura dos dados via broker MQTT;

Documentar o processo de configuração, programação e execução.

## 3. Materiais Utilizados

1x Placa ESP32 (modelo ESP32-WROOM-32D);

1x Sensor DHT11 (temperatura e umidade);

1x Sensor LDR (luminosidade);

Jumpers (macho-macho);

Protoboard ou placa de desenvolvimento com entrada para sensores;

Aplicativo MyMQTT (Android ou iOS);

Conexão Wi-Fi ativa.

## 4. Esquemático de Ligações

O diagrama abaixo representa a conexão entre o ESP32, o sensor DHT11 e o LDR.

![Esquematica de conexões](https://github.com/user-attachments/assets/9613c23e-abf8-4356-a288-e32f98a8f91f)


## 5. Configuração do Ambiente

Instalação do Arduino IDE:

Baixe e instale o Arduino IDE (versão mais recente).

Adicione o suporte à placa ESP32 na ava biblioteca 

Vá em Ferramentas → Placa → Gerenciador de Placas, pesquise ESP32 e instale.

Bibliotecas Necessárias:

DHT sensor library (Adafruit)

PubSubClient (para MQTT)

WiFi (já vem com o ESP32)

## 6. Código-Fonte do ESP32

Anexado no repositorio, so baixar o arquivo .ino e executar, a IDE detectara automaticamente

## 7. Configuração do Servidor MQTT

Para a comunicação MQTT, utilizaremos um servidor local.

**Atenção**
<img width="1035" height="440" alt="image" src="https://github.com/user-attachments/assets/976018ee-8dc2-449e-9a51-f647bb966bb0" />

Como Demostrado nesta imagem e comentado no codigo, precisa verificar a ip do servidor que sera utilizado e a senha e rede wifi onde o esp32 sera conectado, tambem a mudança dos topicos usados para
a inscrição no aplicativo MyMQTT

A seguir um video tutorial de como realizar a instalação do servidor local via maquina virtual Linux:

(https://youtu.be/E3WN9Wq7wOs)


## 8. Configuração do Aplicativo MyMQTT

Baixe o aplicativo MyMQTT na Play Store;

No menu de configurações, adicione um novo servidor:

Host: Ip do seu servidor, o mesmo que sera utilizado no codigo do esp32

Porta: 1883 (Pode ser qualquer uma que esteja liberada, sempre precisa ser igual a do codigo)

Imagem de como vai ser a tela do aplicativo:

![mqtt1](https://github.com/user-attachments/assets/fa639b4a-76ae-45e0-978b-7d6a4ced6cb0)


Adicione os tópicos de leitura conforme o código.

![mymqttsuscribe](https://github.com/user-attachments/assets/bd967211-995c-4e9a-a7c4-bc5ad5facf94)

Como mostrado na imagem acima na ava subscribe voce adicionara um dos topicos pre-definidos no seu codigo:

<img width="1037" height="243" alt="image" src="https://github.com/user-attachments/assets/a4435475-d76f-4452-85d0-105f14182778" />


## 9. Teste e Monitoramento

Após o upload do código:

Abra o Monitor Serial no Arduino IDE para verificar se os dados estão sendo publicados;

No MyMQTT, observe os valores atualizados de temperatura, umidade e luminosidade;

Ajuste o sensor LDR cobrindo ou iluminando o componente e observe a variação dos dados.

## 10. Resultados Esperados

Ao final, o sistema deve:

Conectar-se automaticamente à rede Wi-Fi;

Publicar periodicamente os dados de temperatura, umidade e luminosidade;

Exibir os valores em tempo real no aplicativo MyMQTT.
