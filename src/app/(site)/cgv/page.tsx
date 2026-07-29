import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
};

export default function CgvPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <h1 className="font-display text-3xl text-sage-800 sm:text-4xl">
          Conditions générales de vente
        </h1>
        <p className="mt-3 text-sm text-stone-500">
          Date de dernière mise à jour : 23/07/2026
        </p>

        <div className="mt-10 space-y-8 text-stone-600">
          <section>
            <p>
              L&apos;entrepreneure individuelle Nathalie OHL est une entreprise
              individuelle de droit français identifiée sous le numéro SIREN 839
              563 145 00011 et dont le siège social est sis 12 Lotissement des
              Bosquets – 68130 Altkirch (« Le prestataire »).
            </p>
            <p className="mt-3">
              Le Prestataire peut être joint aux coordonnées suivantes :
              <br />
              12 Lotissement des Bosquets – 68130 Altkirch
              <br />
              06 82 06 69 00
              <br />
              <a
                href="mailto:nathalie.ohl@reflexologie-altkirch.fr"
                className="text-sage-700 underline"
              >
                nathalie.ohl@reflexologie-altkirch.fr
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Article 1 – Champ d&apos;application
            </h2>
            <p className="mt-3">
              Les présentes conditions générales de services (les « Conditions
              Générales ») s&apos;appliquent aux services suivants (les «
              Services ») fournis par le Prestataire à tout consommateur et
              non-professionnel désirant en bénéficier (le « Client ») :
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                Séances de réflexologie plantaire, palmaire, crânio-faciale
              </li>
              <li>
                Séances de réflexologie plantaire en accompagnement en soins de
                support oncologie
              </li>
              <li>Massage assis</li>
              <li>Vente de bons cadeaux</li>
            </ul>
            <p className="mt-3">
              Les caractéristiques principales des Services figurent en Annexe 1
              des présentes.
            </p>
            <p className="mt-3">
              Toute commande de Services emporte, de la part du Client,
              l&apos;acceptation préalable sans restriction ni réserve des
              Conditions Générales, dont le Client déclare avoir pris
              connaissance.
            </p>
            <p className="mt-3">
              Les Conditions Générales sont applicables sous réserve de toute
              stipulation contraire figurant au bon de commande ou à des
              conditions particulières le cas échéant conclues entre le
              Prestataire et le Client concerné.
            </p>
            <p className="mt-3">
              Les Conditions Générales s&apos;entendent sans préjudice des
              dispositions légales applicables et notamment celles prévues par
              le Code de la Consommation.
            </p>

            <h3 className="mt-6 font-medium text-sage-800">
              1.1 Champ d&apos;application des services proposés
            </h3>
            <p className="mt-3">
              Le Prestataire se réserve le droit de refuser toute prestation qui
              n&apos;entrerait pas dans le cadre des formations qu&apos;il a
              reçues et validées par ses certifications ou attestations de
              formation présentielles qu&apos;elle tient, sur demande, à la
              disposition du client.
            </p>
            <p className="mt-3">
              Les différentes techniques proposées et pratiquées n&apos;ont
              aucune visée médicale et ne sont pas assimilables aux actes
              réservés aux professions de santé réglementées par le Code de la
              Santé Publique et au décret n°96-879 du 8 octobre 1996. Elles sont
              considérées comme complémentaires et ne se substituent en aucun
              cas au champ médical réservé aux professions de Santé. Elles
              s&apos;inscrivent dans une démarche complémentaire et personnelle
              de travail sur soi de toute personne qui sollicite le Prestataire.
            </p>
            <p className="mt-3">
              Il appartient au Client de faire toutes vérifications qui semblent
              nécessaires ou opportunes avant de procéder à une quelconque
              réservation de prestations auprès du Prestataire. En cas de
              grossesse ou pathologie grave et quelle que soit la prestation
              souhaitée, il est recommandé au Client de demander l&apos;avis
              préalable de son médecin généraliste ou spécialiste. Il en est de
              même pour les personnes fragiles, comme les personnes âgées, les
              personnes ayant des problèmes psychologiques, cardiologiques ou de
              tension, les personnes sujettes à des allergies, sans que cette
              liste soit limitative.
            </p>
            <p className="mt-3">
              Les règles de déontologie, le secret professionnel et la
              confidentialité seront respectés par le Prestataire. Le
              Prestataire pourra, s&apos;il le juge nécessaire, interrompre à
              tout moment une séance s&apos;il estime que la santé du Client
              l&apos;exige et/ou suivant les contre-indications qu&apos;il aura
              déterminées.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Article 2 – Commandes &amp; Rendez-vous
            </h2>
            <p className="mt-3">
              Tout acompte versé d&apos;avance par le Client portera intérêt au
              taux légal à l&apos;expiration d&apos;un délai de trois (3) mois à
              compter du versement jusqu&apos;à l&apos;exécution des Services,
              sans préjudice de l&apos;obligation du Prestataire de fournir
              lesdits Services.
            </p>

            <h3 className="mt-6 font-medium text-sage-800">2.1 Commandes</h3>
            <p className="mt-3">
              Dans l&apos;éventualité de l&apos;établissement d&apos;un devis
              détaillé pour une commande, celui-ci aura une durée de validité de
              trente (30) jours à compter de sa date de création.
            </p>
            <p className="mt-3">
              La commande est définitive dès signature du devis par le Client,
              ce dernier valant alors bon de commande.
            </p>
            <p className="mt-3">
              Le bon de commande, la nature des Services et leurs modalités
              d&apos;exécution ne pourront être modifiés sans l&apos;accord
              préalable et écrit du Prestataire.
            </p>
            <p className="mt-3">
              En cas d&apos;annulation par le Client d&apos;une commande
              confirmée, avant sa réalisation, pour quelque motif que ce soit,
              et sans préjudice de tous dommages et intérêts complémentaires :
              l&apos;acompte éventuellement versé à la commande par le Client
              restera acquis de plein droit au Prestataire et ne donnera lieu à
              aucun remboursement.
            </p>
            <p className="mt-3">
              Réciproquement, en cas d&apos;annulation par le Prestataire
              d&apos;une commande confirmée ou d&apos;un rendez-vous, pour
              quelque motif que ce soit, l&apos;acompte éventuellement versé à
              la commande par le Client lui sera restitué.
            </p>

            <h3 className="mt-6 font-medium text-sage-800">2.2 Rendez-vous</h3>
            <p className="mt-3">
              En cas d&apos;annulation par le Client d&apos;un rendez-vous
              confirmé, avant la date retenue de la réalisation de la prestation
              de service, pour quelque motif que ce soit, et sans préjudice de
              tous dommages et intérêts complémentaires : l&apos;acompte
              éventuellement versé à la commande par le Client restera acquis de
              plein droit au Prestataire et ne donnera lieu à aucun
              remboursement.
            </p>
            <p className="mt-3">
              Réciproquement, en cas d&apos;annulation par le Prestataire
              d&apos;une commande confirmée ou d&apos;un rendez-vous, pour
              quelque motif que ce soit, l&apos;acompte éventuellement versé à
              la commande par le Client lui sera restitué.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Article 3 – Conditions Tarifaires
            </h2>
            <p className="mt-3">
              Les Services sont fournis au tarif du Prestataire en vigueur au
              jour de la signature du bon de commande, exprimé en euros et sans
              taxe sur la valeur ajoutée (TVA) conformément à l&apos;article 293
              B du Code général des impôts.
            </p>
            <p className="mt-3">
              Les frais éventuels de dossier, de gestion, de réservation,
              d&apos;intermédiation, et autres frais, intérêts et commissions
              sont indiqués sur le bon de commande, ou pour un rendez-vous,
              comme indiqué sur les conditions tarifaires en Annexe 2 des
              présentes conditions générales de vente.
            </p>
            <p className="mt-3">
              Les frais engagés pour l&apos;exécution des Services feront
              l&apos;objet d&apos;une facturation complémentaire au Client
              (frais de déplacement, hébergement, débours, etc.) selon
              l&apos;accord des parties figurant le cas échéant dans le bon de
              commande.
            </p>
            <p className="mt-3">
              Les prix des Services applicables à la date des présentes figurent
              en Annexe 2. Toute modification du tarif des Services prendra
              effet lors de la prochaine période contractuelle.
            </p>
            <p className="mt-3">
              Le tarif est ferme et ne peut être révisé pendant la durée
              d&apos;exécution des Services, les parties renonçant expressément
              à se prévaloir des dispositions de l&apos;article 1195 du Code
              Civil. Toutefois, en cas de demande particulière du Client pendant
              la durée d&apos;exécution des Services, dûment acceptée par écrit
              par le Prestataire, les coûts ou frais y afférents pourront faire
              l&apos;objet d&apos;une facturation spécifique complémentaire.
            </p>
            <p className="mt-3">
              Le Prestataire se réserve le droit de modifier ses prix de son
              catalogue tarifaire à tout moment pour tous Services qui seraient
              souscrits postérieurement à cette modification.
            </p>
            <p className="mt-3">
              Des éventuelles réductions de prix, ristournes et remises pourront
              s&apos;appliquer aux Services dans des conditions prévues en
              Annexe 2 ou dans tout autre document qui serait communiqué au
              Client. En cas de tarif promotionnel, le Prestataire s&apos;engage
              à appliquer ce tarif à toute commande passée durant la période de
              la promotion.
            </p>
            <p className="mt-3">
              Toute modification des tarifs résultant de la création de toute
              nouvelle taxe assise sur le prix des Services sera immédiatement
              et automatiquement appliquée.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Article 4 – Conditions de facturation &amp; de paiement
            </h2>
            <h3 className="mt-4 font-medium text-sage-800">
              4.1 Commandes et devis
            </h3>
            <p className="mt-3">
              Les Services sont facturés et le prix est exigible en totalité et
              payable comptant au jour de leur fourniture.
            </p>

            <h3 className="mt-6 font-medium text-sage-800">4.2 Rendez-vous</h3>
            <p className="mt-3">
              Les Services sont facturés et le prix est exigible en totalité et
              payable comptant au jour de leur fourniture.
            </p>

            <h3 className="mt-6 font-medium text-sage-800">
              4.3 Conditions de facturation et de paiement
            </h3>
            <p className="mt-3">
              Conformément à l&apos;article L. 221-10 du Code de la Consommation
              et sauf exceptions visées à ce même article, lorsque la commande a
              été souscrite hors établissement du Prestataire au sens de
              l&apos;article L.221-1 du Code de la Consommation,
              l&apos;exécution et le paiement des Services ne pourront avoir
              lieu avant l&apos;expiration d&apos;un délai de sept (7) jours à
              compter de la conclusion des présentes par un consommateur, sauf
              demande expresse en sens contraire du Client recueillie dans les
              conditions prévues à l&apos;article L.221-25 du Code de la
              Consommation.
            </p>
            <p className="mt-3">
              Les modes de paiement suivants peuvent être utilisés : espèces,
              chèques, virements bancaires.
            </p>
            <p className="mt-3">
              En présence d&apos;un paiement par chèque, ce dernier doit être
              émis par une banque domiciliée en France métropolitaine ou à
              Monaco. L&apos;encaissement est effectué immédiatement, ou selon
              les conditions convenues entre le Prestataire et le Client dans le
              bon de commande.
            </p>
            <p className="mt-3">
              En cas de règlement anticipé par le Client, aucun escompte ne sera
              pratiqué. En aucun cas les paiements ne peuvent être suspendus ni
              faire l&apos;objet d&apos;une quelconque compensation sans accord
              préalable et écrit entre le Prestataire et le Client. Toute
              suspension, déduction ou compensation opérée unilatéralement par
              le Client sera traitée comme un défaut de paiement et entraînera
              toutes les conséquences d&apos;un retard de paiement.
            </p>
            <p className="mt-3">
              Il est expressément convenu que le Client est valablement mis en
              demeure de payer par la seule exigibilité de l&apos;obligation,
              conformément aux dispositions de l&apos;article 1344 du Code
              civil. En cas de retard de paiement de l&apos;une quelconque des
              échéances, le Prestataire se réserve notamment le droit, sans
              qu&apos;aucune indemnité ne soit due au Client, de :
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                Exiger le paiement immédiat de l&apos;ensemble des sommes à
                devoir au titre des Services, celles-ci devenant immédiatement
                exigibles quelle que soit leur échéance initialement prévue ;
              </li>
              <li>
                Refuser toute nouvelle commande ou exiger pour toute nouvelle
                commande un paiement comptant ou une garantie pour la bonne
                exécution des engagements ;
              </li>
              <li>
                Imputer tout paiement partiel en premier lieu sur la partie non
                privilégiée de la créance puis sur les sommes dont
                l&apos;exigibilité est la plus ancienne ;
              </li>
              <li>
                Réduire, suspendre ou annuler l&apos;accès aux Services, huit
                (8) jours après mise en demeure restée sans effet, effectuée par
                le Prestataire auprès du Client ;
              </li>
              <li>
                Appliquer, sans mise en demeure préalable, à toutes les sommes
                dues, dès le premier jour de retard et jusqu&apos;à complet
                paiement, des pénalités de retard calculées au taux visé à
                l&apos;article L.441-6 du Code de Commerce.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Article 5 – Modalités de fourniture des services
            </h2>
            <p className="mt-3">
              Le Prestataire n&apos;est tenu de fournir les Services commandés
              par le Client qu&apos;en cas de paiement partiel ou total du prix
              et encaissement effectif de celui-ci dans les conditions ci-avant
              indiquées à l&apos;article 3.
            </p>
            <p className="mt-3">
              En l&apos;absence d&apos;exécution immédiate des Services, ceux-ci
              seront fournis à la date ou dans le délai figurant dans le bon de
              commande ou à la date convenue par chaque partie lors de la prise
              de rendez-vous, au lieu convenu avec le Client et préalablement
              accepté par le Prestataire.
            </p>
            <p className="mt-3">
              Le Prestataire déclare disposer des compétences, de
              l&apos;expérience et des moyens nécessaires pour fournir les
              Services, et assumera la pleine responsabilité de l&apos;exécution
              des Services.
            </p>
            <p className="mt-3">
              Le Prestataire fournira les Services de bonne foi et mettra en
              œuvre toutes les diligences requises pour l&apos;exécution de ses
              obligations au titre des présentes Conditions Générales, dans le
              respect des dispositions législatives et réglementaires et des
              droits de tiers.
            </p>
            <p className="mt-3">
              Le Prestataire a une obligation de moyens et non de résultats.
              Notamment, le Prestataire s&apos;engage à :
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                Apporter tous les soins requis par la diligence professionnelle
                et les usages de la place à l&apos;exécution des Services ;
              </li>
              <li>
                Mettre le cas échéant en œuvre ou à disposition les moyens
                adéquats pour l&apos;exécution des Services ;
              </li>
              <li>
                En l&apos;absence d&apos;exécution immédiate des Services, faire
                ses meilleurs efforts, assurer le respect du délai ou calendrier
                figurant dans le bon de commande ou lors du rendez-vous convenu
                avec le Client.
              </li>
            </ul>
            <p className="mt-3">
              Le Prestataire collaborera activement et de bonne foi avec le
              Client en tous domaines, en vue de la bonne exécution des
              Services, et informera immédiatement le Client de toute difficulté
              ou de tout litige survenu au cours de l&apos;exécution de sa
              mission. Le Prestataire fournira les Services en totale
              indépendance et autonomie.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Article 6 – Obligations du client
            </h2>
            <p className="mt-3">
              Le Client collabore activement et de bonne foi avec le Prestataire
              en tous domaines en vue de la bonne exécution des Services.
            </p>
            <p className="mt-3">
              Il communique notamment des informations et documents au caractère
              complet, précis exact et sincère et prend les décisions
              raisonnablement nécessaires dans les délais requis pour
              l&apos;exécution des Services. Le Prestataire sera autorisé à
              utiliser tout élément communiqué par le Client pour les besoins de
              la réalisation des Services ou obtenu par le biais de sources
              d&apos;informations publiques généralement considérées comme
              fiables et à présumer, sans que sa responsabilité ne puisse être
              engagée, que cet élément est exact, précis, sincère, complet et ne
              comporte pas d&apos;inexactitude ou d&apos;insuffisance
              susceptible d&apos;en altérer la portée.
            </p>
            <p className="mt-3">
              Le Client ne peut modifier, en cours d&apos;exécution des
              Services, leur nature ou leurs modalités de fourniture, sauf
              accord préalable et écrit du Prestataire.
            </p>
            <p className="mt-3">
              Il s&apos;engage à informer immédiatement le Prestataire de toute
              difficulté, réserve ou de tout litige survenu au cours de
              l&apos;exécution des Services, afin de permettre le cas échéant un
              règlement amiable de la situation. Le Client verse le prix des
              Services dans les conditions et selon les modalités prévues aux
              présentes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Article 7 – Réclamations
            </h2>
            <p className="mt-3">
              En cas de retard dans la fourniture des Services, pour tout autre
              cause que la force majeure ou le fait du Client, le Client pourra
              résoudre la commande dans les conditions prévues aux articles
              L.216-2, L.216-3 et L.241-4 du Code de la consommation, après
              avoir enjoint le Prestataire de fournir les Services dans un délai
              supplémentaire raisonnable.
            </p>
            <p className="mt-3">
              Les sommes avancées par le Client lui seront alors rétrocédées au
              plus tard quatorze (14) jours suivant la date à laquelle le
              contrat aura été dénoncé.
            </p>
            <p className="mt-3">
              En cas d&apos;exécution défectueuse des Services, le Client devra
              notifier le Prestataire et formuler ses griefs, ses réserves et
              les justificatifs pertinents dans un délai de trente (30) jours
              calendaires suivant la date où il en a connaissance, afin de
              permettre aux parties de faire leurs meilleurs efforts en vue de
              parvenir à un règlement amiable de la situation dans un délai de
              trente (30) jours calendaires suivant la notification initiale du
              Client.
            </p>
            <p className="mt-3">
              A défaut de réserves ou de réclamations expressément émises par le
              Client lors de la fourniture des Services dans ce délai, aucune
              réclamation ne pourra être valablement acceptée par le
              Prestataire.
            </p>
            <p className="mt-3">
              Le cas échéant et en cas de prise en compte de la réclamation du
              Client, le Prestataire pourra procéder à un remboursement partiel
              ou total du Client ou rectifier et corriger les Services fournis
              dans les meilleurs délais.
            </p>
            <p className="mt-3">
              A défaut de règlement amiable dans les conditions susvisées et en
              cas d&apos;inexécution suffisamment grave du Prestataire, le
              Client pourra résilier les Conditions Générales dans les
              conditions prévues à l&apos;article 11 et obtenir le cas échéant
              des dommages et intérêts du Prestataire aux fins de réparer le
              préjudice subi, le Client renonçant par avance à solliciter une
              exécution forcée en nature des Services par le Prestataire ou un
              tiers ou une réduction proportionnelle du prix, par dérogation
              expresse aux dispositions des articles 1221, 1222 et 1223 du Code
              civil.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Article 8 – Responsabilité du prestataire
            </h2>
            <p className="mt-3">
              Le Prestataire est tenu à une obligation de moyens au titre de la
              fourniture des Services.
            </p>
            <p className="mt-3">
              La responsabilité du Prestataire ne saurait être engagée :
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                En cas de manquement à une quelconque obligation résultant
                d&apos;un cas fortuit, d&apos;un évènement de force majeure au
                sens de l&apos;article 1218 du Code Civil ou du fait du Client
                ou d&apos;un tiers ;
              </li>
              <li>
                Dans le cas où les informations, données, instructions,
                directives, communiqués par le Client sont erronés ou
                incomplets, et plus généralement dans le cas où
                l&apos;inexécution ou l&apos;exécution défectueuse des Services
                résulte en tout ou partie du comportement, d&apos;un manquement
                ou d&apos;une carence du Client ;
              </li>
              <li>
                En cas d&apos;utilisation des résultats des Services pour un
                objet ou une finalité différente de ceux pour lesquels le
                Prestataire est intervenu, de mise en œuvre erronée des
                recommandations du Prestataire ou d&apos;absence de prise en
                compte des réserves émises par le Prestataire ;
              </li>
              <li>En cas de dommage indirect ou non prévisible ;</li>
              <li>
                En cas de non-respect de la législation du pays dans lequel les
                Services sont fournis, qu&apos;il appartient au Client, qui est
                seul responsable du choix des Services demandés, de vérifier.
              </li>
            </ul>

            <h3 className="mt-6 font-medium text-sage-800">
              8.1 Responsabilité civile professionnelle
            </h3>
            <p className="mt-3">
              Le Prestataire a souscrit auprès d&apos;une compagnie notoire une
              assurance en responsabilité civile professionnelle et juridique.
            </p>
            <p className="mt-3">
              Il est précisé que la responsabilité du Prestataire ne saurait
              être engagée en cas de dommages liés à la négligence d&apos;un
              client, en particulier s&apos;il n&apos;a pas révélé au
              Prestataire l&apos;existence de contre-indications
              l&apos;affectant, que ce soit lors de l&apos;entretien de la
              première séance ou des rendez-vous ultérieurs en cas de
              modifications de son état de santé personnel.
            </p>

            <h3 className="mt-6 font-medium text-sage-800">
              8.2 Incapacité de travail
            </h3>
            <p className="mt-3">
              En cas d&apos;incapacité physique temporaire, par suite de maladie
              ou d&apos;accident du Prestataire, celui-ci se réserve le droit de
              programmer de nouvelles dates de rendez-vous en concertation avec
              le Client sans qu&apos;il ne puisse exiger de versement
              d&apos;indemnités.
            </p>
            <p className="mt-3">
              En cas d&apos;incapacité physique permanente du Prestataire, tout
              engagement avec le client du Prestataire seront résiliés de plein
              droit sans qu&apos;il ne puisse être réclamé au prestataire une
              quelconque indemnité compensatrice.
            </p>
            <p className="mt-3">
              Les acomptes perçus seront restitués au client dans un délai
              maximal de 8 (huit) jours suivant la notification
              d&apos;incapacité au Client. Pour les bons cadeaux en cours de
              validité à la date de l&apos;incapacité de travail constatée, la
              validité desdits bons cadeaux pourra être reportée pour une durée
              correspondante à la durée initiale desdits bons cadeaux, à compter
              de la reprise d&apos;activité de Mme Nathalie OHL.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Article 9 – Propriété intellectuelle
            </h2>
            <p className="mt-3">
              Sauf accord préalable écrit du Prestataire, le Prestataire est le
              propriétaire exclusif de tous les droits de propriété
              intellectuelle portant sur les éléments communiqués au Client dans
              le cadre de la fourniture des Services, et notamment de façon non
              limitative sur la charte graphique, le titre, la forme, le plan et
              la structure des informations et documents communiqués, les
              textes, les logos, les marques, les images et photographes, les
              animations et vidéos, les slogans, les bases de données et plus
              généralement tout ou partie des éléments communiqués. En
              conséquence, les présentes Conditions Générales n&apos;entraînent
              le transfert d&apos;aucun de ces droits de propriété
              intellectuelle au profit du Client, qui s&apos;interdit de
              reproduire, d&apos;utiliser et/ou de représenter, par quelque
              procédé que ce soit, même partiellement, tout élément sur lequel
              le Prestataire détient un droit de propriété intellectuelle.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Article 10 – Données personnelles
            </h2>
            <h3 className="mt-4 font-medium text-sage-800">
              10.1 Nature des données à caractère personnel collectées
            </h3>
            <p className="mt-3">
              Le Prestataire s&apos;engage à ne collecter que des données à
              caractère personnel adéquates, pertinentes et limitées à ce qui
              est nécessaire au regard des finalités pour lesquelles elles sont
              traitées. Aucune donnée à caractère personnel considérée comme «
              sensible », telle que l&apos;origine raciale ou ethnique, les
              opinions politiques, philosophiques ou religieuses ne saurait être
              demandée ni collectée auprès du Client.
            </p>
            <p className="mt-3">
              Le Client est informé par les présentes de ce que les données à
              caractère personnel signalées comme étant obligatoires sur les
              formulaires et recueillies dans le cadre du service décrit dans
              les présentes sont nécessaires à la réalisation de la Prestation.
              Parmi les données à caractère personnel du Client que le
              Prestataire collecte auprès de lui peuvent figurer :
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Ses noms et prénoms,</li>
              <li>Téléphone, adresse électronique, adresse postale,</li>
              <li>Données de santé.</li>
            </ul>

            <h3 className="mt-6 font-medium text-sage-800">
              10.2 Finalité du traitement des données à caractère personnel
            </h3>
            <p className="mt-3">
              Des données personnelles sont susceptibles d&apos;être collectées
              et utilisées par le Prestataire aux fins de permettre la
              fourniture des Services, et peuvent être transmises aux sociétés
              chargées de la gestion, de l&apos;exécution et du traitement des
              opérations de paiement.
            </p>
            <p className="mt-3">
              Les données collectées sont également susceptibles d&apos;être
              utilisées dans le cadre de la gestion des relations commerciales
              afin d&apos;établir des statistiques, d&apos;effectuer des études
              de marché et de comportement et de permettre au Prestataire
              d&apos;améliorer et de personnaliser les Services.
            </p>

            <h3 className="mt-6 font-medium text-sage-800">
              10.3 Conservation, sécurité et confidentialité des données à
              caractère personnel
            </h3>
            <p className="mt-3">
              Les données personnelles collectées sont traitées et stockées dans
              des conditions visant à assurer leur sécurité et sont conservées
              pour la durée strictement nécessaire à la réalisation des
              finalités visées à l&apos;article 10.2 des présentes Conditions
              Générales.
            </p>
            <p className="mt-3">
              Ces données peuvent également être conservées à des fins de
              sécurité et de conservation, afin de respecter les obligations
              légales et réglementaires auxquelles le Prestataire est soumis.
            </p>
            <p className="mt-3">
              Le Prestataire s&apos;engage à mettre en place des mesures de
              sécurité techniques et organisationnelles en vue de garantir la
              sécurité, l&apos;intégrité et la confidentialité de toutes les
              données à caractère personnel, afin d&apos;empêcher que celles-ci
              soient déformées, endommagées ou que des tiers non autorisés y
              aient accès.
            </p>
            <p className="mt-3">
              Toutefois, il est précisé qu&apos;aucune mesure de sécurité
              n&apos;étant infaillible, le Prestataire ne saurait garantir une
              sécurité absolue aux données à caractère personnel du Client.
            </p>

            <h3 className="mt-6 font-medium text-sage-800">
              10.4 Transfert des données à caractère personnel
            </h3>
            <p className="mt-3">
              Aucun transfert de données à caractère personnel n&apos;est
              réalisé hors de l&apos;Union Européenne.
            </p>
            <p className="mt-3">
              Sauf dans le cas où un tiers demanderait au Client d&apos;accepter
              une charte de confidentialité et des conditions
              d&apos;utilisations qui lui sont propres, les sociétés tierces
              ayant reçu communication des données à caractère personnel de
              l&apos;Utilisateur se sont engagées à traiter ses données à
              caractère personnel uniquement pour la mise en œuvre des Services
              du Prestataire.
            </p>
            <p className="mt-3">
              Le Prestataire s&apos;engage à ne jamais partager les données à
              caractère personnel du Client, sans avoir obtenu son consentement
              préalable, avec des sociétés tierces à des fins marketing et/ou
              commerciales.
            </p>
            <p className="mt-3">
              Toutefois, le Prestataire pourra être amené à divulguer des
              données à caractère personnel du Client aux autorités
              administrative ou judiciaire lorsque leur divulgation est
              nécessaire à l&apos;identification, l&apos;interpellation ou la
              poursuite en justice de tout individu susceptible de porter
              préjudice aux droits du Prestataire, de tout autre client ou
              d&apos;un tiers. Le Prestataire peut enfin être légalement tenu de
              divulguer les données à caractère personnel de l&apos;Utilisateur
              et ne saurait dans ce cas s&apos;y opposer.
            </p>

            <h3 className="mt-6 font-medium text-sage-800">
              10.5 Droits du Client sur ses données à caractère personnel
            </h3>
            <p className="mt-3">
              Conformément au Règlement Général sur la Protection des Données
              2016/679 du 27 avril 2016 (« RGPD »), tout Client dispose
              d&apos;un droit d&apos;accès, de rectification et
              d&apos;effacement des données personnelles le concernant,
              qu&apos;il peut exercer directement auprès du service clients du
              Prestataire en le contactant à l&apos;adresse électronique{" "}
              <a
                href="mailto:nathalie.ohl@reflexologie-altkirch.fr"
                className="text-sage-700 underline"
              >
                nathalie.ohl@reflexologie-altkirch.fr
              </a>{" "}
              ou à l&apos;adresse postale suivante 12 Lotissement des Bosquets –
              68130 Altkirch en joignant à sa demande une copie d&apos;un titre
              d&apos;identité.
            </p>
            <p className="mt-3">
              En outre, dans les limites posées par la loi, le Client dispose
              également du droit de s&apos;opposer au traitement, de le limiter,
              de décider du sort post-mortem de ses données, de retirer son
              consentement à tout moment et du droit à la portabilité des
              données à caractère personnel fournies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Article 11 – Durée – Résiliation
            </h2>
            <p className="mt-3">
              En cas de vente ponctuelle ou en application de conditions
              particulières, les présentes Conditions Générales sont conclues
              pour la durée de fourniture des Services, telle que mentionnée le
              cas échéant dans des conditions particulières ou dans le bon de
              commande.
            </p>
            <p className="mt-3">
              Le Prestataire ou le Client pourra résilier les Conditions
              Générales de plein droit de manière anticipée par l&apos;envoi
              d&apos;une notification écrite :
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                En cas de survenance d&apos;un cas de force majeure visé à
                l&apos;article 7 des présentes ;
              </li>
              <li>
                Après avoir notifié l&apos;autre partie en cas de manquement
                grave de celle-ci à ses obligations ou au titre des lois et
                règlements applicables, auquel il n&apos;aurait pas été remédié
                dans un délai de quinze (15) jours (lorsqu&apos;il peut être
                remédié à ce manquement) suivant notification écrite indiquant
                la nature du manquement et la nécessité d&apos;y remédier.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Article 12 – Rétractation
            </h2>
            <p className="mt-3">
              Le cas échéant, lorsqu&apos;une commande de Services a été
              souscrite par un Client consommateur à distance, ou hors
              établissement du Prestataire au sens de l&apos;article L.221-1 du
              Code de la Consommation, le Client disposera d&apos;un délai de
              rétractation de quatorze (14) jours francs à compter du jour de la
              signature du bon de commande, la computation du délai
              s&apos;effectuant selon les modalités prévues à l&apos;article
              L.221-19 du Code de la Consommation.
            </p>
            <p className="mt-3">
              Le Client pourra notifier sa décision de se rétracter de sa
              commande au moyen du formulaire de rétractation figurant en Annexe
              3 des présentes ou d&apos;une déclaration claire et dénuée
              d&apos;ambiguïté à l&apos;adresse postale ou électronique du
              Prestataire.
            </p>
            <p className="mt-3">
              Le Prestataire accusera le cas échéant réception de la demande de
              rétractation conforme.
            </p>
            <p className="mt-3">
              Le cas échéant, le remboursement du prix versé par le Client pour
              les Services interviendra dans un délai de quatorze (14) jours à
              compter du jour où le Prestataire aura été informé de la décision
              de rétractation de sa commande par le Client, en utilisant le même
              moyen de paiement que celui utilisé par le Client lors de la
              transaction initiale. A cet égard, il est précisé qu&apos;en cas
              de demande expresse du Client d&apos;exécution des Services avant
              la fin du délai de rétractation, ce dernier devra s&apos;acquitter
              du prix des Services dont il a bénéficié préalablement à sa
              rétractation, conformément aux dispositions de l&apos;article
              L.221-25 du Code de la Consommation.
            </p>
            <p className="mt-3">
              Nonobstant ce qui précède, il est précisé que le droit de
              rétractation ne s&apos;appliquera pas pour la fourniture des
              services visés à l&apos;article L.221-28 du Code de la
              Consommation, notamment en cas de fourniture de Services
              pleinement exécutés avant la fin du délai de rétractation et dont
              l&apos;exécution a commencé après accord préalable du Client et
              renonciation à son droit de rétractation.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Article 13 – Notifications
            </h2>
            <p className="mt-3">
              Toute notification ou convocation écrite requise ou permise en
              vertu des stipulations des présentes sera valablement effectuée si
              elle est adressée par lettre remise en main propre ou par porteur
              contre reçu de livraison, par courrier recommandé avec avis de
              réception, ou par courrier électronique (sauf en cas de
              résiliation des présentes), adressé aux coordonnées de la partie
              concernée, le prestataire élisant domicile en son siège social et
              le Client en son domicile personnel.
            </p>
            <p className="mt-3">
              Tout changement de coordonnées d&apos;une partie pour les besoins
              des présentes devra être notifié à l&apos;autre partie selon les
              modalités prévues ci-dessus.
            </p>
            <p className="mt-3">
              Les notifications adressées en mains propres ou par porteur seront
              présumées avoir été faites à leur date de remise au destinataire,
              telle qu&apos;attestée par le reçu de livraison. Les notifications
              faites par courrier recommandé avec avis de réception seront
              présumées avoir été faites à la date de leur première présentation
              à l&apos;adresse du destinataire. Les notifications faites par
              courrier électronique seront présumées avoir été faites à la date
              d&apos;envoi du courrier électronique.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Article 14 – Autonomie &amp; absence de renonciation
            </h2>
            <p className="mt-3">
              Si l&apos;une quelconque des stipulations des présentes Conditions
              générales était déclarée nulle ou inapplicable pour quelque cause
              que ce soit en application d&apos;une loi, d&apos;un règlement ou
              à la suite d&apos;une décision de justice devenue définitive, elle
              serait réputée non écrite et les autres stipulations resteraient
              en vigueur.
            </p>
            <p className="mt-3">
              Le fait pour le Prestataire de ne pas se prévaloir à titre
              temporaire ou permanent d&apos;une ou de plusieurs stipulations
              des Conditions Générales n&apos;emportera en aucun cas
              renonciation.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Article 15 – Modification
            </h2>
            <p className="mt-3">
              Le Prestataire se réserve le droit de modifier à tout moment le
              contenu des présentes Conditions Générales pour la passation de
              nouveaux Services ou les modifications tarifaires.
            </p>
            <p className="mt-3">
              Toute commande ou prise de rendez-vous consécutive à une
              modification apportée aux Conditions Générales emportera
              acceptation par chaque Client de la nouvelle version des
              Conditions Générales qui lui sera communiquée.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Article 16 – Litiges
            </h2>
            <p className="mt-3">
              Le Client est informé qu&apos;il est libre de recourir
              gratuitement à un médiateur de la consommation en vue de la
              résolution amiable d&apos;un litige qui l&apos;opposerait au
              Prestataire.
            </p>
            <p className="mt-3">
              Conformément aux articles L.616-1 et R.616-1 du code de la
              consommation, l&apos;entreprise individuelle Nathalie OHL a mis en
              place un dispositif de médiation de la consommation. L&apos;entité
              de médiation retenue est : MEDIATION CONSOMMATION
              DÉVELOPPEMENT/MED CONSO DEV. En cas de litige, tout consommateur
              pourra déposer sa réclamation sur le site{" "}
              <a
                href="https://www.cnpm-mediation-consommation.eu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-700 underline"
              >
                www.cnpm-mediation-consommation.eu
              </a>{" "}
              ou par voie postale en écrivant à :
            </p>
            <p className="mt-3">
              MEDIATION CONSOMMATION DÉVELOPPEMENT/MED CONSO DEV
              <br />
              Centre d&apos;Affaires Stéphanois SAS
              <br />
              Immeuble l&apos;Horizon – Esplanade de France
              <br />
              3, rue J. Constant Milleret – 42000 Saint-Étienne
            </p>
            <p className="mt-3">
              Tous les litiges auxquels les Conditions Générales pourraient
              donner lieu, concernant tant leur validité, interprétation,
              exécution, résiliation, leurs conséquences et leurs suites, seront
              soumis au tribunal de Mulhouse (68).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Article 17 – Droit applicable &amp; langue
            </h2>
            <p className="mt-3">
              Les présentes Conditions Générales et les opérations qui en
              découlent sont régies et soumises au droit français. Elles sont
              rédigées en langue française. En cas de traduction en une ou
              plusieurs langues étrangères, seul le texte français fera foi en
              cas de litige.
            </p>
          </section>

          <hr className="border-sage-200/70" />

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Annexe 1 : Descriptif des Services
            </h2>
            <h3 className="mt-4 font-medium text-sage-800">
              Prestations de réflexologie
            </h3>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                Réflexologie Plantaire (comprenant les soins de support en
                oncologie, si besoin)
              </li>
              <li>Réflexologie Crânio-Faciale</li>
              <li>Réflexologie Palmaire</li>
              <li>Réflexologie Plantaire bébé-enfant jusqu&apos;à 11 ans</li>
            </ul>

            <h3 className="mt-6 font-medium text-sage-800">
              Prestations de massage
            </h3>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Massage Assis</li>
            </ul>

            <h3 className="mt-6 font-medium text-sage-800">
              Vente de chèques cadeau
            </h3>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Montant au choix.</li>
              <li>La durée de validité de ces chèques est de 1 an.</li>
              <li>
                Les chèques cadeau ne pourront faire l&apos;objet d&apos;aucun
                remboursement. En cas de dépassement de la durée de validité,
                ils pourront faire l&apos;objet d&apos;une seule prolongation
                exceptionnelle de 1 mois.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Annexe 2 : Conditions tarifaires
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                Réflexologie plantaire : 60 € – Séance d&apos;environ 50 min –
                1h
              </li>
              <li>
                Réflexologie plantaire – Forfait de 4 séances : 60 € (séances
                faites dans une période de 3 mois après la 1ère séance)
              </li>
              <li>
                Réflexologie plantaire en accompagnement en soins de support
                oncologie : 60 € – Séance d&apos;environ 50 min – 1h
              </li>
              <li>
                Réflexologie plantaire enfant 0 à 11 ans : 30 € – Séance
                d&apos;environ 20-30 min
              </li>
              <li>
                Réflexologie crânio-faciale : 60 € – Séance d&apos;environ 1h
              </li>
              <li>
                Réflexologie palmaire : 60 € – Séance d&apos;environ 50 min – 1h
              </li>
              <li>
                Réflexologie plantaire + palmaire : 70 € – Séance d&apos;environ
                1h15
              </li>
              <li>
                Réflexologie crânio-faciale + palmaire : 70 € – Séance
                d&apos;environ 1h15
              </li>
              <li>Massage assis : 30 € – Séance d&apos;1h</li>
              <li>
                Réflexologie plantaire et massage assis : 85 € – Séance
                d&apos;1h20
              </li>
              <li>
                Réflexologie crânio-faciale et massage assis : 85 € – Séance
                d&apos;1h20
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-sage-800">
              Annexe 3 : Formulaire de rétractation
            </h2>
            <p className="mt-3">
              Si le Client souhaite faire valoir son droit de rétractation –
              dans le respect des conditions prévues à l&apos;article 12 des
              présentes Conditions Générales, il a la possibilité
              d&apos;utiliser le formulaire ci-dessous :
            </p>
            <div className="mt-4 rounded-xl border border-sage-200/70 p-5 text-sm">
              <p>À l&apos;attention de : Nathalie OHL</p>
              <p className="mt-3">
                Je vous notifie par la présente ma rétractation du contrat
                portant sur la prestation de services suivante :
              </p>
              <p className="mt-3">Nom(s) et référence(s) de(s) commande(s) :</p>
              <p className="mt-3">Commandé(s) le :</p>
              <p className="mt-3">
                Nom du client à l&apos;origine de la commande :
              </p>
              <p className="mt-3">
                Adresse du client à l&apos;origine de la commande :
              </p>
              <p className="mt-3">Signature du client :</p>
            </div>
          </section>
        </div>
      </Container>
    </section>
  );
}
