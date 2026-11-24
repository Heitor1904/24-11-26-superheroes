import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const API_URL = "https://superheroes-api-one.vercel.app/api/herois";

export default function Home() {
  const [herois, setHerois] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");

  const carregaHeroes = async (pullToRefresh = false) => {
    try {
      if (pullToRefresh) setAtualizando(true);
      else setCarregando(true);
      setErro("");

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Não foi possível carregar os heróis. Tente novamente.");
      }

      const data = await response.json();
      const lista = Array.isArray(data) ? data : data?.herois || [];
      setHerois(lista);
    } catch (error) {
      setErro(error.message || "Ocorreu um erro inesperado.");
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  };

  useEffect(() => {
    carregaHeroes();
  }, []);

  const heroisFiltrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    if (!termo) return herois;

    return herois.filter((heroi) =>
      String(heroi.nome || "").toLocaleLowerCase("pt-BR").includes(termo)
    );
  }, [busca, herois]);

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardImageWrap}>
        {item.foto ? (
          <Image
            source={{ uri: item.foto }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>★</Text>
          </View>
        )}
        <View style={styles.cardNumber}>
          <Text style={styles.cardNumberText}>
            {String(index + 1).padStart(2, "0")}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.heroName} numberOfLines={1}>
          {item.nome || "Herói sem nome"}
        </Text>

        <View style={styles.powerRow}>
          <Text style={styles.powerLabel}>FORÇA</Text>
          <Text style={styles.powerValue}>{item.forca ?? "Não informada"}</Text>
        </View>

        <View style={styles.cardDivider} />

        <Text style={styles.skillLabel}>HABILIDADES</Text>
        <Text style={styles.skillText}>
          {item.habilidade || "Nenhuma habilidade cadastrada."}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#090F1F" />
      <FlatList
        data={heroisFiltrados}
        keyExtractor={(item, index) =>
          String(item.id ?? item.nome ?? index)
        }
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.cardRow}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => carregaHeroes(true)}
            tintColor="#F7B733"
            colors={["#F7B733"]}
          />
        }
        ListHeaderComponent={
          <View>
            <View style={styles.topLine}>
              <View style={styles.brandMark}>
                <Text style={styles.brandMarkText}>S</Text>
              </View>
              <Text style={styles.brandText}>HERO<Text style={styles.brandAccent}>VERSE</Text></Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>UNIVERSO HEROICO</Text>
              </View>
            </View>

            <View style={styles.heroHeader}>
              <Text style={styles.eyebrow}>ESCOLHA SEU CAMPEÃO</Text>
              <Text style={styles.pageTitle}>HERÓIS{"\n"}EM DESTAQUE</Text>
              <Text style={styles.subtitle}>
                Conheça os personagens, descubra seus poderes e explore suas habilidades.
              </Text>
            </View>

            <View style={styles.statsBar}>
              <View>
                <Text style={styles.statNumber}>{herois.length}</Text>
                <Text style={styles.statCaption}>PERSONAGENS</Text>
              </View>
              <View style={styles.statDivider} />
              <View>
                <Text style={styles.statNumber}>∞</Text>
                <Text style={styles.statCaption}>POSSIBILIDADES</Text>
              </View>
            </View>

            <View style={styles.sectionHeading}>
              <View>
                <Text style={styles.sectionTitle}>Todos os heróis</Text>
                <Text style={styles.sectionSubtitle}>Explore a coleção completa</Text>
              </View>
              <Text style={styles.resultCount}>
                {heroisFiltrados.length} encontrados
              </Text>
            </View>

            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>⌕</Text>
              <TextInput
                value={busca}
                onChangeText={setBusca}
                placeholder="Buscar herói pelo nome..."
                placeholderTextColor="#7F8AA3"
                style={styles.searchInput}
                returnKeyType="search"
                accessibilityLabel="Buscar herói pelo nome"
              />
              {busca.length > 0 && (
                <Pressable onPress={() => setBusca("")} hitSlop={10}>
                  <Text style={styles.clearSearch}>×</Text>
                </Pressable>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          carregando ? (
            <View style={styles.stateBox}>
              <ActivityIndicator size="large" color="#F7B733" />
              <Text style={styles.stateTitle}>Carregando heróis...</Text>
              <Text style={styles.stateDescription}>
                Estamos preparando sua próxima aventura.
              </Text>
            </View>
          ) : erro ? (
            <View style={styles.stateBox}>
              <Text style={styles.stateIcon}>!</Text>
              <Text style={styles.stateTitle}>Ops! Algo deu errado.</Text>
              <Text style={styles.stateDescription}>{erro}</Text>
              <Pressable style={styles.retryButton} onPress={() => carregaHeroes()}>
                <Text style={styles.retryButtonText}>Tentar novamente</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.stateBox}>
              <Text style={styles.stateIcon}>⌕</Text>
              <Text style={styles.stateTitle}>Nenhum herói encontrado</Text>
              <Text style={styles.stateDescription}>
                Tente pesquisar usando outro nome.
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          !carregando && !erro && heroisFiltrados.length > 0 ? (
            <Text style={styles.footerText}>FIM DA LISTA • CONTINUE EXPLORANDO</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#090F1F",
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 34,
  },
  topLine: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#202A40",
    marginBottom: 30,
  },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F7B733",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  brandMarkText: {
    color: "#111827",
    fontSize: 23,
    fontWeight: "900",
    fontStyle: "italic",
  },
  brandText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  brandAccent: {
    color: "#F7B733",
  },
  liveBadge: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#17243A",
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 20,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#57D6A1",
    marginRight: 6,
  },
  liveText: {
    color: "#AAB5CA",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  heroHeader: {
    paddingBottom: 22,
  },
  eyebrow: {
    color: "#F7B733",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2.2,
    marginBottom: 12,
  },
  pageTitle: {
    color: "#FFFFFF",
    fontSize: 43,
    lineHeight: 46,
    fontWeight: "900",
    letterSpacing: -1.2,
  },
  subtitle: {
    color: "#AAB5CA",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
    maxWidth: 310,
  },
  statsBar: {
    backgroundColor: "#121D32",
    borderWidth: 1,
    borderColor: "#25324A",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  statNumber: {
    color: "#F7B733",
    fontSize: 21,
    fontWeight: "900",
  },
  statCaption: {
    color: "#8794AC",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 2,
  },
  statDivider: {
    height: 34,
    width: 1,
    backgroundColor: "#344159",
    marginHorizontal: 26,
  },
  sectionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  sectionSubtitle: {
    color: "#8794AC",
    fontSize: 11,
    marginTop: 4,
  },
  resultCount: {
    color: "#F7B733",
    fontSize: 10,
    fontWeight: "700",
    paddingBottom: 2,
  },
  searchBox: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#121D32",
    borderWidth: 1,
    borderColor: "#2A3852",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    marginBottom: 18,
  },
  searchIcon: {
    color: "#F7B733",
    fontSize: 25,
    marginRight: 9,
    lineHeight: 28,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 12,
    paddingVertical: 0,
  },
  clearSearch: {
    color: "#AAB5CA",
    fontSize: 23,
    paddingLeft: 8,
  },
  cardRow: {
    justifyContent: "space-between",
    marginBottom: 13,
  },
  card: {
    width: "48.3%",
    backgroundColor: "#121D32",
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#26344D",
  },
  cardImageWrap: {
    height: 142,
    backgroundColor: "#202D45",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#202D45",
  },
  placeholderText: {
    color: "#F7B733",
    fontSize: 42,
  },
  cardNumber: {
    position: "absolute",
    top: 9,
    left: 9,
    backgroundColor: "rgba(9,15,31,0.82)",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  cardNumberText: {
    color: "#F7B733",
    fontSize: 9,
    fontWeight: "900",
  },
  cardContent: {
    padding: 11,
  },
  heroName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 10,
  },
  powerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
  },
  powerLabel: {
    color: "#8794AC",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  powerValue: {
    color: "#F7B733",
    fontSize: 10,
    fontWeight: "800",
    flexShrink: 1,
    textAlign: "right",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#29364D",
    marginVertical: 10,
  },
  skillLabel: {
    color: "#8794AC",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  skillText: {
    color: "#D5DCEC",
    fontSize: 10,
    lineHeight: 15,
  },
  stateBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
    backgroundColor: "#121D32",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#26344D",
    marginTop: 3,
    marginBottom: 20,
  },
  stateIcon: {
    color: "#F7B733",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 8,
  },
  stateTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 12,
    textAlign: "center",
  },
  stateDescription: {
    color: "#AAB5CA",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 7,
  },
  retryButton: {
    backgroundColor: "#F7B733",
    borderRadius: 9,
    paddingHorizontal: 17,
    paddingVertical: 11,
    marginTop: 17,
  },
  retryButtonText: {
    color: "#111827",
    fontSize: 11,
    fontWeight: "900",
  },
  footerText: {
    color: "#65738D",
    textAlign: "center",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.3,
    marginTop: 14,
    marginBottom: 10,
  },
});
